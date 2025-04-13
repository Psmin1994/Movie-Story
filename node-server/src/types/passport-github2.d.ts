// NaverStrategy 타입 정의
declare module "passport-github2" {
  import passport from "passport";

  interface Profile extends passport.Profile {
    provider: "github";
    id: string;
    username: string;
  }

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    svcType?: number;
  }

  type VerifyFunction = (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => void;

  export class Strategy extends passport.Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
  }
}
