import ForbiddenException from "../../exceptions/forbiddenException";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class JwtService {
  private issuer = process.env.JWT_ISSUER;
  private secret = process.env.JWT_SECRET ?? "DEVELOPMENT_SECRET";
  private expTime = 60 * 60 * 24 * 7; // 7 days

  public sign(sub: string) {
    let token = null;

    try {
      token = jwt.sign(
        {
          data: sub,
        },
        this.secret,
        { expiresIn: this.expTime, issuer: this.issuer }
      );
    } catch (e) {
      console.error(e);
      throw new ForbiddenException("Error while signing the token...");
    }

    return token;
  }

  public decode(token: string) {
    let sub = "";

    try {
      const parseToken = jwt.verify(token, this.secret, {
        issuer: this.issuer,
      }) as JwtPayload;

      sub = parseToken.data!;
    } catch (e) {
      console.error(e);
      throw new ForbiddenException("Error while verifying the token...");
    }

    return sub;
  }
}
