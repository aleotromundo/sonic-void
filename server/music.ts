import axios from "axios";

export type MusicTrack = {
  id: string;
  source: "spotify" | "musicbrainz";
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

export type LyricsResult = {
  status: "available" | "not_configured" | "not_found" | "unavailable";
  text: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  message: string;
};

let tokenCache: { token: string; expiresAt: number } | null = null;
let lastMusicBrainzCall = 0;

function env(name: string) { return process.env[name]?.trim() || ""; }
function durationLabel(durationMs: number) { const totalSeconds = Math.round(durationMs / 1000); return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`; }

async function getSpotifyToken() {
  const clientId = env("SPOTIFY_CLIENT_ID");
  const clientSecret = env("SPOTIFY_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.token;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({ grant_type: "client_credentials" }).toString(), { headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" }, timeout: 10_000 });
  tokenCache = { token: response.data.access_token, expiresAt: Date.now() + response.data.expires_in * 1000 };
  return tokenCache.token;
}

function toSpotifyTrack(track: any): MusicTrack {
  return { id: track.id, source: "spotify", name: track.name, artist: track.artists.map((artist: any) => artist.name).join(", "), album: track.album.name, releaseDate: track.album.release_date, releaseYear: track.album.release_date?.slice(0, 4) ?? "—", durationMs: track.duration_ms, durationLabel: durationLabel(track.duration_ms), popularity: track.popularity, imageUrl: track.album.images?.[0]?.url ?? null, spotifyUrl: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`, previewUrl: track.preview_url ?? null, availableMarkets: track.available_markets ?? [] };
}

async function fetchSpotify(query: string, offset: number, limit: number) {
  const token = await getSpotifyToken();
  if (!token) return null;
  const response = await axios.get("https://api.spotify.com/v1/search", { params: { q: query, type: "track", limit, offset, market: "US" }, headers: { Authorization: `Bearer ${token}` }, timeout: 10_000 });
  const tracks = response.data.tracks;
  const items = tracks.items.map(toSpotifyTrack);
  return { configured: true, source: "spotify" as const, items, total: tracks.total, nextOffset: offset + items.length < tracks.total ? offset + items.length : null };
}

async function waitForMusicBrainzSlot() {
  const wait = Math.max(0, 1000 - (Date.now() - lastMusicBrainzCall));
  if (wait) await new Promise(resolve => setTimeout(resolve, wait));
  lastMusicBrainzCall = Date.now();
}

async function searchMusicBrainz(query: string, offset: number, limit: number) {
  await waitForMusicBrainzSlot();
  const response = await axios.get("https://musicbrainz.org/ws/2/recording", { params: { query, fmt: "json", limit, offset }, headers: { "User-Agent": "SonicVoid/1.0 (personal music finder)" }, timeout: 10_000 });
  const recordings = response.data.recordings ?? [];
  const items: MusicTrack[] = recordings.map((recording: any) => {
    const release = recording.releases?.[0];
    const releaseGroupId = release?.["release-group"]?.id;
    const releaseDate = release?.date ?? "";
    return { id: recording.id, source: "musicbrainz", name: recording.title ?? "Untitled recording", artist: recording["artist-credit"]?.map((credit: any) => credit.name ?? credit.artist?.name).filter(Boolean).join(", ") ?? "Unknown artist", album: release?.title ?? "Unknown release", releaseDate, releaseYear: releaseDate.slice(0, 4) || "—", durationMs: recording.length ?? 0, durationLabel: recording.length ? durationLabel(recording.length) : "—", popularity: 0, imageUrl: releaseGroupId ? `https://coverartarchive.org/release-group/${releaseGroupId}/front-500` : null, spotifyUrl: `https://musicbrainz.org/recording/${recording.id}`, previewUrl: null, availableMarkets: [] };
  });
  return { configured: true, source: "musicbrainz" as const, items, total: response.data.count ?? items.length, nextOffset: offset + items.length < (response.data.count ?? items.length) ? offset + items.length : null };
}

export async function searchMusic(query: string, offset: number, limit = 12) {
  const spotifyResult = await fetchSpotify(query, offset, limit);
  return spotifyResult ?? searchMusicBrainz(query, offset, limit);
}

export async function searchSpotifyOnly(query: string, offset: number, limit = 12) { return fetchSpotify(query, offset, limit); }
export async function searchSpotify(query: string, offset: number, limit = 12) { return searchSpotifyOnly(query, offset, limit); }
export async function isSpotifyConfigured() { return Boolean(env("SPOTIFY_CLIENT_ID") && env("SPOTIFY_CLIENT_SECRET")); }

export async function getGeniusLyrics(name: string, artist: string): Promise<LyricsResult> {
  const accessToken = env("GENIUS_ACCESS_TOKEN");
  if (!accessToken) return { status: "not_configured", text: null, sourceUrl: null, sourceName: null, message: "Configurá GENIUS_ACCESS_TOKEN para habilitar la búsqueda en Genius." };
  try {
    const response = await axios.get("https://api.genius.com/search", { params: { q: `${name} ${artist}` }, headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10_000 });
    const hit = response.data.response?.hits?.[0]?.result;
    if (!hit) return { status: "not_found", text: null, sourceUrl: null, sourceName: null, message: "No encontramos una página de letras coincidente en Genius." };
    return { status: "unavailable", text: null, sourceUrl: hit.url, sourceName: "Genius", message: "Genius autoriza la búsqueda y los metadatos, pero su API pública no entrega el texto completo de las letras. Abrí la página original para leerlas allí." };
  } catch { return { status: "unavailable", text: null, sourceUrl: null, sourceName: null, message: "Genius no respondió. Podés reintentar en unos segundos." }; }
}
