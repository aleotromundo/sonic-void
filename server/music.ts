import axios from "axios";

export type MusicTrack = {
  id: string;
  source: "spotify" | "musicbrainz" | "audius";
  kind: "track" | "album";
  name: string;
  artist: string;
  album: string;
  releaseDate: string;
  releaseYear: string;
  durationMs: number;
  durationLabel: string;
  popularity: number;
  imageUrl: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
  availableMarkets: string[];
};

type SearchIntent = { type: "artist" | "album" | "track" | "free"; artist?: string; terms?: string };
export type SyncedLyricLine = { timeMs: number; text: string };
export type LyricsResult = { status: "available" | "not_configured" | "not_found" | "instrumental" | "rate_limited" | "unavailable"; text: string | null; syncedLyrics: SyncedLyricLine[]; sourceUrl: string | null; sourceName: string | null; message: string };

let tokenCache: { token: string; expiresAt: number } | null = null;
let lastMusicBrainzCall = 0;
function env(name: string) { return process.env[name]?.trim() || ""; }
function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
function durationLabel(durationMs: number) { const totalSeconds = Math.round(durationMs / 1000); return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`; }

export function interpretQuery(input: string): SearchIntent {
  const query = input.trim().replace(/\s+/g, " ");
  const normalized = normalize(query);
  const albumMatch = normalized.match(/^(?:albumes?|albums?|discos?|discografia)\s+(?:de|del)\s+(.+)$/);
  if (albumMatch) return { type: "album", artist: albumMatch[1] };
  const artistMatch = normalized.match(/^(?:canciones?|temas?|musica|musicas)\s+(?:de|del)\s+(.+)$/);
  if (artistMatch) return { type: "track", artist: artistMatch[1] };
  if (normalized.startsWith("artista ")) return { type: "artist", artist: normalized.slice(8).trim() };
  if (!normalized.includes(" ") || normalized.length < 28) return { type: "artist", artist: normalized };
  return { type: "free", terms: query };
}

async function getSpotifyToken() {
  const clientId = env("SPOTIFY_CLIENT_ID"); const clientSecret = env("SPOTIFY_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.token;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({ grant_type: "client_credentials" }).toString(), { headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" }, timeout: 10_000 });
  tokenCache = { token: response.data.access_token, expiresAt: Date.now() + response.data.expires_in * 1000 };
  return tokenCache.token;
}

function toSpotifyTrack(track: any): MusicTrack { return { id: track.id, source: "spotify", kind: "track", name: track.name, artist: track.artists.map((artist: any) => artist.name).join(", "), album: track.album.name, releaseDate: track.album.release_date, releaseYear: track.album.release_date?.slice(0, 4) ?? "—", durationMs: track.duration_ms, durationLabel: durationLabel(track.duration_ms), popularity: track.popularity, imageUrl: track.album.images?.[0]?.url ?? null, spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`, previewUrl: track.preview_url ?? null, availableMarkets: track.available_markets ?? [] }; }

async function fetchSpotify(query: string, offset: number, limit: number) {
  const token = await getSpotifyToken(); if (!token) return null;
  let response;
  try { response = await axios.get("https://api.spotify.com/v1/search", { params: { q: query, type: "track", limit, offset, market: "US" }, headers: { Authorization: `Bearer ${token}` }, timeout: 10_000 }); }
  catch (error: any) { const status = error?.response?.status; if (status === 401 || status === 403 || status === 429) return null; throw error; }
  const tracks = response.data.tracks; const items = tracks.items.map(toSpotifyTrack);
  return { configured: true, source: "spotify" as const, items, total: tracks.total, nextOffset: offset + items.length < tracks.total ? offset + items.length : null };
}

async function waitForMusicBrainzSlot() { const wait = Math.max(0, 1000 - (Date.now() - lastMusicBrainzCall)); if (wait) await new Promise(resolve => setTimeout(resolve, wait)); lastMusicBrainzCall = Date.now(); }
async function musicBrainzGet(path: string, params: Record<string, string | number>) { await waitForMusicBrainzSlot(); return axios.get(`https://musicbrainz.org/ws/2/${path}`, { params: { ...params, fmt: "json" }, headers: { "User-Agent": "SonicVoid/1.0 (personal music finder)" }, timeout: 10_000 }); }

function artistExactMatch(artists: any[], name: string) { const target = normalize(name); return artists.find(artist => normalize(artist.name) === target); }
export function rankMusicTracks(items: MusicTrack[], query: string) { const target = normalize(query); const score = (item: MusicTrack) => { const name = normalize(item.name); const artist = normalize(item.artist); const album = normalize(item.album); return (name === target ? 120 : 0) + (album === target ? 100 : 0) + (artist === target ? 90 : 0) + (name.startsWith(target) ? 35 : 0) + (album.startsWith(target) ? 25 : 0) + (artist.includes(target) ? 15 : 0); }; return [...items].sort((a, b) => score(b) - score(a)); }
function toAudiusTrack(track: any): MusicTrack { const artist = track.user?.name ?? track.user?.handle ?? "Audius artist"; const artwork = track.artwork?.['1000x1000'] ?? track.artwork?.['480x480'] ?? track.artwork?.['150x150'] ?? null; const permalink = track.permalink ? String(track.permalink).replace(/^\/+/, "") : `${track.user?.handle ? `${track.user.handle}/` : ""}${track.slug ?? track.id}`; const durationMs = Math.round((track.duration ?? 0) * 1000); return { id: String(track.id), source: "audius", kind: "track", name: track.title ?? "Untitled track", artist, album: "Audius", releaseDate: track.release_date ?? "", releaseYear: track.release_date?.slice(0, 4) ?? "—", durationMs, durationLabel: durationLabel(durationMs), popularity: Math.min(100, Math.round(Math.log10((track.play_count ?? 0) + 1) * 20)), imageUrl: artwork, spotifyUrl: `https://audius.co/${permalink}`, previewUrl: `https://api.audius.co/v1/tracks/${track.id}/stream`, availableMarkets: [] }; }

async function searchAudius(query: string, limit: number) { const response = await axios.get("https://api.audius.co/v1/tracks/search", { params: { query, limit, only_downloadable: false }, headers: { "User-Agent": "SonicVoid/1.0 (personal music finder)" }, timeout: 10_000 }); const items = (response.data?.data ?? []).filter((track: any) => track?.id && track?.title).map(toAudiusTrack); return { configured: true, source: "audius" as const, items, total: response.data?.total ?? items.length, nextOffset: null }; }

async function safeAudiusSearch(query: string, limit: number) { try { return await searchAudius(query, limit); } catch (error) { console.warn("[Audius] Search unavailable:", error instanceof Error ? error.message : "unknown error"); return null; } }

export function matchesAudioQuery(track: MusicTrack, query: string) { const words = normalize(query).split(" ").filter(word => word.length > 2); const haystack = normalize(`${track.name} ${track.artist}`); return words.length > 0 && words.every(word => haystack.includes(word)); }
export function matchesAudioCandidate(primary: MusicTrack, fallback: MusicTrack, query: string) { const artistMatch = normalizedExact(primary.artist, fallback.artist); const titleMatch = normalizedMatch(primary.name, fallback.name); const durationMatch = !primary.durationMs || !fallback.durationMs || Math.abs(primary.durationMs - fallback.durationMs) <= Math.max(15_000, primary.durationMs * 0.1); return durationMatch && ((primary.kind === "album" && artistMatch) || (primary.kind === "track" && artistMatch && titleMatch)); }

function toAlbumResult(group: any, artistName: string): MusicTrack { const date = group["first-release-date"] ?? ""; return { id: group.id, source: "musicbrainz", kind: "album", name: group.title ?? "Untitled album", artist: artistName, album: group.title ?? "Unknown release", releaseDate: date, releaseYear: date.slice(0, 4) || "—", durationMs: 0, durationLabel: "—", popularity: 0, imageUrl: `https://coverartarchive.org/release-group/${group.id}/front-500`, spotifyUrl: `https://musicbrainz.org/release-group/${group.id}`, previewUrl: null, availableMarkets: [] }; }

async function findArtist(artistName: string) { const response = await musicBrainzGet("artist", { query: `artist:"${artistName}"`, limit: 5 }); return artistExactMatch(response.data.artists ?? [], artistName); }
async function searchArtistAlbums(artistName: string, offset: number, limit: number) { const artist = await findArtist(artistName); if (!artist) return { configured: true, source: "musicbrainz" as const, items: [] as MusicTrack[], total: 0, nextOffset: null }; const response = await musicBrainzGet("release-group", { artist: artist.id, limit, offset, type: "album|ep" }); const groups = response.data["release-groups"] ?? []; return { configured: true, source: "musicbrainz" as const, items: groups.map((group: any) => toAlbumResult(group, artist.name)), total: response.data["release-group-count"] ?? groups.length, nextOffset: offset + groups.length < (response.data["release-group-count"] ?? groups.length) ? offset + groups.length : null }; }

async function searchMusicBrainzRecordings(query: string, offset: number, limit: number, rankingQuery = query) { const response = await musicBrainzGet("recording", { query, limit, offset }); const recordings = response.data.recordings ?? []; const items: MusicTrack[] = recordings.map((recording: any) => { const release = recording.releases?.[0]; const releaseGroupId = release?.["release-group"]?.id; const date = release?.date ?? recording["first-release-date"] ?? ""; return { id: recording.id, source: "musicbrainz", kind: "track", name: recording.title ?? "Untitled recording", artist: recording["artist-credit"]?.map((credit: any) => credit.name ?? credit.artist?.name).filter(Boolean).join(", ") ?? "Unknown artist", album: release?.title ?? "Unknown release", releaseDate: date, releaseYear: date.slice(0, 4) || "—", durationMs: recording.length ?? 0, durationLabel: recording.length ? durationLabel(recording.length) : "—", popularity: 0, imageUrl: releaseGroupId ? `https://coverartarchive.org/release-group/${releaseGroupId}/front-500` : null, spotifyUrl: `https://musicbrainz.org/recording/${recording.id}`, previewUrl: null, availableMarkets: [] };   }); const rankedItems = rankMusicTracks(items, rankingQuery); return { configured: true, source: "musicbrainz" as const, items: rankedItems, total: response.data.count ?? rankedItems.length, nextOffset: offset + rankedItems.length < (response.data.count ?? rankedItems.length) ? offset + rankedItems.length : null }; }

export async function searchMusicBrainz(query: string, offset: number, limit = 12) { const intent = interpretQuery(query); if ((intent.type === "artist" || intent.type === "album") && intent.artist) { const albums = await searchArtistAlbums(intent.artist, offset, limit); if (albums.items.length || albums.total > 0) return albums; return searchMusicBrainzRecordings(query, offset, limit, query); } if (intent.type === "track" && intent.artist) return searchMusicBrainzRecordings(`artist:"${intent.artist}"`, offset, limit, intent.artist); return searchMusicBrainzRecordings(query, offset, limit, query); }
export function emptySearchResult(source: "spotify" | "musicbrainz" | "audius" = "musicbrainz") { return { configured: true, source, items: [] as MusicTrack[], total: 0, nextOffset: null }; }
async function safeSpotifySearch(query: string, offset: number, limit: number) { try { return await fetchSpotify(query, offset, limit); } catch (error) { console.warn("[Spotify] Search unavailable:", error instanceof Error ? error.message : "unknown error"); return null; } }
export async function searchMusic(query: string, offset: number, limit = 12) { const intent = interpretQuery(query); try { const primary = intent.type === "artist" || intent.type === "album" || intent.type === "track" ? await searchMusicBrainz(query, offset, limit) : (await safeSpotifySearch(query, offset, limit)) ?? await searchMusicBrainz(query, offset, limit); if (primary.items.some((item: MusicTrack) => Boolean(item.previewUrl)) || offset > 0) return primary; const fallbackQuery = intent.artist ?? intent.terms ?? query; const audius = await safeAudiusSearch(fallbackQuery, limit); const matchedAudius = audius ? audius.items.filter((item: MusicTrack) => matchesAudioQuery(item, fallbackQuery) && primary.items.some((candidate: MusicTrack) => matchesAudioCandidate(candidate, item, fallbackQuery))) : []; return matchedAudius.length ? { ...audius, items: rankMusicTracks(matchedAudius, fallbackQuery), total: matchedAudius.length } : primary; } catch (error) { console.warn("[Music] Primary source unavailable, using fallback:", error instanceof Error ? error.message : "unknown error"); const fallbackQuery = intent.artist ?? intent.terms ?? query; const audius = await safeAudiusSearch(fallbackQuery, limit); const matchedAudius = audius ? audius.items.filter((item: MusicTrack) => matchesAudioQuery(item, fallbackQuery)) : []; return matchedAudius.length ? { ...audius, items: rankMusicTracks(matchedAudius, fallbackQuery), total: matchedAudius.length } : emptySearchResult(); } }
export async function searchSpotifyOnly(query: string, offset: number, limit = 12) { return fetchSpotify(query, offset, limit); }
export async function searchSpotify(query: string, offset: number, limit = 12) { return searchSpotifyOnly(query, offset, limit); }
export async function isSpotifyConfigured() { return Boolean(env("SPOTIFY_CLIENT_ID") && env("SPOTIFY_CLIENT_SECRET")); }

function parseSyncedLyrics(value: string | null | undefined): SyncedLyricLine[] { if (!value) return []; return value.split(/\r?\n/).flatMap(line => { const match = line.match(/^\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/); if (!match) return []; const fraction = match[3] ? Number(match[3].padEnd(3, "0")) : 0; return [{ timeMs: (Number(match[1]) * 60 + Number(match[2])) * 1000 + fraction, text: match[4].trim() }]; }).filter(line => line.text.length > 0).sort((a, b) => a.timeMs - b.timeMs); }

export function parseLrcLyrics(value: string) { return parseSyncedLyrics(value); }

function normalizeMatch(value: string | undefined) { return (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function normalizedMatch(left: string | undefined, right: string | undefined) { const a = normalizeMatch(left); const b = normalizeMatch(right); return Boolean(a && b && (a === b || a.includes(b) || b.includes(a))); }
function normalizedExact(left: string | undefined, right: string | undefined) { const a = normalizeMatch(left); const b = normalizeMatch(right); return Boolean(a && b && a === b); }

export function isLrclibMatch(data: { trackName?: string; artistName?: string; albumName?: string; duration?: number }, name: string, artist: string, album?: string, duration?: number) { const titleOk = normalizedMatch(data.trackName, name); const artistOk = normalizedExact(data.artistName, artist); const albumOk = !album || !data.albumName || normalizedExact(data.albumName, album); const durationOk = !duration || !data.duration || Math.abs(data.duration - duration) <= Math.max(8, duration * 0.05); return titleOk && artistOk && albumOk && durationOk; }

export async function getLrclibLyrics(name: string, artist: string, album?: string, duration?: number): Promise<LyricsResult> { const base = { text: null, syncedLyrics: [], sourceUrl: "https://lrclib.net/", sourceName: "LRCLIB" }; try { const response = await axios.get("https://lrclib.net/api/get", { params: { track_name: name, artist_name: artist, ...(album ? { album_name: album } : {}), ...(duration && duration > 0 ? { duration } : {}) }, headers: { "User-Agent": "SonicVoid/1.0 (personal music finder)" }, timeout: 10_000 }); const data = response.data; if (!data || data.instrumental) return { ...base, status: "instrumental", message: "Esta pista figura como instrumental en LRCLIB." }; if (!isLrclibMatch(data, name, artist, album, duration)) return { ...base, status: "not_found", message: "LRCLIB devolvió una coincidencia débil que fue descartada." }; const syncedLyrics = parseSyncedLyrics(data.syncedLyrics); const text = data.plainLyrics ?? (syncedLyrics.length ? syncedLyrics.map(line => line.text).join("\\n") : null); if (!text && !syncedLyrics.length) return { ...base, status: "not_found", message: "No encontramos letras coincidentes para esta pista." }; return { ...base, status: "available", text, syncedLyrics, message: syncedLyrics.length ? "Letras sincronizadas disponibles." : "Letras disponibles sin sincronización." }; } catch (error: any) { if (error?.response?.status === 404) return { ...base, status: "not_found", message: "No encontramos letras coincidentes para esta pista." }; if (error?.response?.status === 429) return { ...base, status: "rate_limited", message: "LRCLIB pidió esperar antes de realizar otra búsqueda." }; return { ...base, status: "unavailable", message: "LRCLIB no respondió. Podés reintentar en unos segundos." }; }
}

export async function getGeniusLyrics(name: string, artist: string): Promise<LyricsResult> { const accessToken = env("GENIUS_ACCESS_TOKEN"); if (!accessToken) return { status: "not_configured", text: null, syncedLyrics: [], sourceUrl: null, sourceName: null, message: "Configurá GENIUS_ACCESS_TOKEN para habilitar la búsqueda en Genius." }; try { const response = await axios.get("https://api.genius.com/search", { params: { q: `${name} ${artist}` }, headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10_000 }); const hit = response.data.response?.hits?.[0]?.result; if (!hit) return { status: "not_found", text: null, syncedLyrics: [], sourceUrl: null, sourceName: null, message: "No encontramos una página de letras coincidente en Genius." }; return { status: "unavailable", text: null, syncedLyrics: [], sourceUrl: hit.url, sourceName: "Genius", message: "Genius autoriza la búsqueda y los metadatos, pero su API pública no entrega el texto completo de las letras. Abrí la página original para leerlas allí." }; } catch { return { status: "unavailable", text: null, syncedLyrics: [], sourceUrl: null, sourceName: null, message: "Genius no respondió. Podés reintentar en unos segundos." }; } }
