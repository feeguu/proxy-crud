import * as jose from "jose";

export class TokenService {
  private secret: Uint8Array;
  constructor(secret: string) {
    this.secret = new TextEncoder().encode(secret);
  }
  async verifyToken(token: string): Promise<object> {
    return (await jose.jwtVerify(token, this.secret)).payload;
  }

  async createToken(payload: Record<any, any>): Promise<string> {
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(this.secret);
  }
} 