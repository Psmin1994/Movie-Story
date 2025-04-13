// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy as NaverV2Strategy, Profile } from 'passport-naver-v2';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from '../auth.service';

// interface NaverProfile extends Profile {
//   email: string;
//   nickname: string;
// }

// @Injectable()
// export class NaverStrategy extends PassportStrategy(NaverV2Strategy, 'naver') {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly configService: ConfigService,
//   ) {
//     console.log(1);

//     super(
//       {
//         clientID: configService.get<string>('NAVER_CLIENT_ID'),
//         clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
//         callbackURL: configService.get<string>('NAVER_CALLBACK_URL'),
//         scope: ['email', 'nickname'],
//         svcType: 0,
//         state: true,
//       }, // ✅ 직접 verify 콜백 전달
//       async (req, accessToken, refreshToken, profile, done) => {
//         try {
//           console.log(req, accessToken, refreshToken, profile);
//           console.log(2);

//           const user = await this.authService.validateOAuthLogin({
//             provider: profile.provider,
//             provider_user_id: profile.id,
//             email: profile.email,
//             nickname: profile.nickname,
//             access_token: accessToken,
//             refresh_token: refreshToken,
//           });
//           return done(null, user);
//         } catch (err) {
//           return done(err, false);
//         }
//       },
//     );
//   }

//   // 이 validate는 사용되지 않음. (verify 콜백으로 대체됨)
//   validate() {
//     return;
//   }
// }
