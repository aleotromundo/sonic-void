import { describe, expect, it } from "vitest";
import axios from "axios";

describe("Spotify credentials", () => {
  it.skipIf(process.env.VALIDATE_SPOTIFY_LIVE !== "1")("obtains a short-lived client-credentials token from Spotify", async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
    expect(clientId, "SPOTIFY_CLIENT_ID must be configured").toBeTruthy();
    expect(clientSecret, "SPOTIFY_CLIENT_SECRET must be configured").toBeTruthy();

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      { headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" }, timeout: 10_000 },
    );

    expect(response.status).toBe(200);
    expect(response.data.access_token).toEqual(expect.any(String));
    expect(response.data.expires_in).toBeGreaterThan(0);
  }, 15_000);
});
