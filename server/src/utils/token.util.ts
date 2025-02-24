import jwt from "jsonwebtoken";
import { AppError } from "middlewares/errorHandler.js";
import { JwtUserDTO } from "dtos/user.dto";

// redis 사용 시 활성화
// import redisClient from "config/redisClient.js";

const { JsonWebTokenError, TokenExpiredError } = jwt;

export default {
  // AccessToken 생성
  generateAccessToken: (payload: JwtUserDTO) => {
    try {
      const secretKey = process.env.ACCESS_TOKEN_SECRET;

      if (!secretKey) {
        throw new AppError("Failed to load environment variables", 500);
      }

      return jwt.sign(payload, secretKey, {
        expiresIn: "30m", // 유효기간
        algorithm: "HS256", // 암호화 알고리즘
      });
    } catch (err) {
      if (err instanceof AppError) throw err;

      throw new AppError("Failed to generate access token", 500);
    }
  },

  // RefreshToken 생성 + Redis에 저장
  generateRefreshToken: async (payload: JwtUserDTO) => {
    try {
      const secretKey = process.env.REFRESH_TOKEN_SECRET;

      if (!secretKey) {
        throw new AppError("Failed to load environment variables", 500);
      }

      const refreshToken = jwt.sign(payload, secretKey, {
        expiresIn: "3h",
        algorithm: "HS256",
      });

      // Refresh Token 저장소에 저장
      // redisClient.set(payload.id, refreshToken, { EX: 60 * 60 * 3 });

      return refreshToken;
    } catch (err) {
      if (err instanceof AppError) throw err;

      throw new AppError("Failed to generate refresh token", 500);
    }
  },

  // RefreshToken 검증
  verifyRefreshToken: async (refreshToken: string) => {
    try {
      let secretKey = process.env.REFRESH_TOKEN_SECRET;

      if (!secretKey) throw new AppError("Failed to load environment variables", 500);

      const decode = jwt.verify(refreshToken, secretKey) as JwtUserDTO;

      // 저장소에 저장된 Refresh Token 가져오기
      // const storedToken = await redisClient.get(decode.id);
      // if (!storedToken) {
      //   throw new AppError("No stored refresh token found", 401);
      // } else if (storedToken !== refreshToken) {
      //   throw new AppError("Refresh token mismatch", 401);
      // }

      return decode;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AppError("Refresh token expired", 401);
      } else if (err instanceof JsonWebTokenError) {
        throw new AppError("Invalid refresh token", 401);
      } else {
        // 기타 예상치 못한 오류
        throw err;
      }
    }
  },

  // Refresh Token 저장소에서 삭제
  DeleteRefreshToken: async (refreshToken: string) => {
    try {
      let secretKey = process.env.REFRESH_TOKEN_SECRET;

      if (!secretKey) throw new AppError("Failed to load environment variables", 500);

      const decode = jwt.verify(refreshToken, secretKey) as JwtUserDTO;

      // const deleteResult = await redisClient.del(`${decode.id}`);

      return;
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new AppError("Invalid refresh token", 401);
      } else {
        // 기타 예상치 못한 오류
        throw err;
      }
    }
  },
};
