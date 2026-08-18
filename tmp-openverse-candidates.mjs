import axios from "axios";
import { probePlayableStream } from "./server/music.ts";
const response = await axios.get("https://api.openverse.org/v1/audio/", { params: { q: "music", page_size: 12, filter_dead: true, extension: "mp3,ogg,wav,m4a", mature: false }, timeout: 20000, headers: { "User-Agent": "SonicVoid/1.0 (personal music finder)" } });
const items = response.data.results ?? [];
const results = await Promise.all(items.map(async (item) => ({ id: item.id, url: item.url, probe: await probePlayableStream(item.url, { timeoutMs: 5000 }) })));
for (const result of results) console.log(JSON.stringify({ id: result.id, url: result.url, ok: result.probe.ok, method: result.probe.method, status: result.probe.status, type: result.probe.contentType, reason: result.probe.reason, ms: result.probe.latencyMs }));
