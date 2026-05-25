import type { Token } from "../types/api.js";

const YAZIO_BASE_URL = "https://yzapi.yazio.com/v15";
const CLIENT_ID = "1_4hiybetvfksgw40o0sog4s884kwc840wwso8go4k8c04goo4c";
const CLIENT_SECRET = "6rok2m65xuskgkgogw40wkkk8sw0osg84s8cggsc4woos4s8o";

export class YazioAuth {
  private token: Token | null = null;
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async getAccessToken(): Promise<string> {
    if (this.token && this.token.expires_at > Date.now() + 60_000) {
      return this.token.access_token;
    }
    await this.authenticate();
    return this.token!.access_token;
  }

  private async authenticate(): Promise<void> {
    const res = await fetch(`${YAZIO_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username: this.email,
        password: this.password,
        grant_type: "password",
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Yazio auth failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    this.token = {
      ...data,
      expires_at: Date.now() + data.expires_in * 1000,
    };
  }
}
