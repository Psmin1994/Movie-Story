// NaverStrategy 타입 정의
declare module "passport-naver-v2" {
  import passport from "passport";

  interface Profile extends passport.Profile {
    provider: "naver";
    id: string;
    name: string;
    email: string;
    _json: {
      response: {
        nickname: string;
        profile_image?: string;
        age?: string;
        gender?: string;
        email: string;
        name: string;
      };
    };
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
