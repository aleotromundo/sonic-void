import axios from "axios";
import { describe, expect, it } from "vitest";

describe("Jamendo credentials", () => {
  it("accepts the configured client id", async () => {
    const clientId = process.env.JAMENDO_CLIENT_ID;
    expect(clientId).toBeTruthy();
    const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
      params: { client_id: clientId, format: "json", limit: 1, search: "ambient" },
      timeout: 15_000,
    });
    expect(response.status).toBe(200);
    expect(response.data?.headers?.status).toBe("success");
  }, 20_000);
});
