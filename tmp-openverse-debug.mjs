import { probePlayableStream, searchOpenCatalog } from "./server/music.ts";
const direct = await probePlayableStream("https://prod-1.storage.jamendo.com/?trackid=345141&format=mp32", { timeoutMs: 5000 });
console.log("direct", JSON.stringify(direct));
const catalog = await searchOpenCatalog(0, 24);
console.log("catalog", JSON.stringify({ count: catalog.items.length, total: catalog.total, items: catalog.items.map((item) => ({ id: item.id, source: item.source, url: item.previewUrl })) }));
