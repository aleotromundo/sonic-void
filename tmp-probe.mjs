import axios from "axios";
const url = "https://prod-1.storage.jamendo.com/?trackid=345141&format=mp32";
for (const method of ["HEAD", "GET"]) {
  const response = await axios.request({ url, method, headers: method === "GET" ? { Range: "bytes=0-1", Accept: "audio/*" } : { Accept: "audio/*" }, responseType: method === "GET" ? "stream" : "text", timeout: 8000, maxRedirects: 3, maxContentLength: method === "GET" ? 8192 : 5000000, validateStatus: () => true });
  console.log(JSON.stringify({ method, status: response.status, contentType: response.headers?.["content-type"], contentLength: response.headers?.["content-length"] }));
  if (response.data?.destroy) response.data.destroy();
}
