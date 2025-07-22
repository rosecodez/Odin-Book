declare module "passport"
import "express-session";

declare module 'express-session' {
  interface SessionData {
    accessToken?: string;
    user?: User;
  }
}
