import { Strategy as LocalStrategy } from "passport-local";
import { verifyPassword } from "utils/crypto.util.js";
import { AppError } from "middlewares/errorHandler.js";
import UserDAO from "models/user.model.js";

const localStrategy = new LocalStrategy(
  // new LocalStrategy의 첫번째 인자에 객체 형태로 여러 옵션 지정
  // passReqToCallback : 요청 객체(req)를 콜백에 전달 (default : false)
  {
    usernameField: "id", // 아이디 정보가 들어있는 필드명 지정 (default : username)
    passwordField: "password", // 비밀번호 정보가 들어있는 필드명 지정 (default : password)
    session: false, // 세션 저장 여부 (default : true)
  },
  async (id, password, done) => {
    try {
      let user = await UserDAO.checkUserById(id);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // 비밀번호 검증
      const isValidPassword = await verifyPassword(id, password);

      if (!isValidPassword) {
        throw new AppError("Incorrect Password", 401);
      }

      return done(null, { id });
    } catch (err) {
      return done(err);
    }
  }
);

export default localStrategy;
