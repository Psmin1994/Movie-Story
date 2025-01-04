import { Strategy as LocalStrategy } from "passport-local";
import { userPasswordVerify } from "../utils/crypto.util.js";
import userStorage from "../models/user.model.js";

export default (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      // new LocalStrategy의 첫번째 인자에 객체 형태로 여러 옵션 지정
      // passReqToCallback : 요청 객체(req)를 콜백에 전달 (default : false)
      {
        usernameField: "id", // 아이디 정보가 들어있는 필드명 지정 (default : username)
        passwordField: "password", // 비밀번호 정보가 들어있는 필드명 지정 (default : password)
        session: false, // 세션 저장 여부 (default : true)
      },
      async (id, password, done) => {
        try {
          let user = await userStorage.getUserById(id);

          if (!user) {
            return done(null, false, {
              success: false,
              message: "가입되지 않은 회원입니다.",
            });
          }

          let checkedPassword = await userPasswordVerify(password, user.password);

          if (checkedPassword) {
            return done(null, user.id);
          }

          done(null, false, {
            success: false,
            message: "비밀번호가 틀렸습니다",
          });
        } catch (err) {
          done(err);
        }
      }
    )
  );
};
