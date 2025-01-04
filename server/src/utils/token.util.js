import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

const createTokenError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  throw error;
};

export default {
  // AccessToken 생성
  generateAccessToken: (payload) => {
    try {
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m", // 유효기간
        algorithm: "HS256", // 암호화 알고리즘
      });
    } catch (err) {
      createTokenError("Generate access token fail", "ACCESS_TOKEN_ERROR");
    }
  },

  // RefreshToken 생성 + Redis에 저장
  generateRefreshToken: async (payload) => {
    try {
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "3h",
        algorithm: "HS256",
      });

      // RefreshToken Redis에 저장
      redisClient.set(payload.id, refreshToken, { EX: 60 * 60 * 3 });

      return refreshToken;
    } catch (err) {
      createTokenError("Generate refresh token fail", "REFRESH_TOKEN_ERROR");
    }
  },

  // AccessToken 검증
  verifyAccessToken: (accessToken) => {
    try {
      return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        createTokenError("Refresh token expired", "TOKEN_EXPIRED");
      } else {
        throw err; // 기타 예상치 못한 오류
      }
    }
  },

  // RefreshToken 검증
  verifyRefreshToken: async (refreshToken) => {
    try {
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Redis에 저장된 RefreshToken 가져오기
      const storedToken = await redisClient.get(decode.id);

      if (!storedToken) {
        createTokenError("No refreshToken in Redis", "TOKEN_NOT_FOUND");
      }

      return decode;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        createTokenError("Refresh token expired", "TOKEN_EXPIRED");
      } else if (err.name === "JsonWebTokenError") {
        createTokenError("No refresh token", "TOKEN_NOT_FOUND");
      } else {
        // 기타 예상치 못한 오류
        throw err;
      }
    }
  },

  DeleteRefreshToken: async (refreshToken) => {
    try {
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const deleteResult = await redisClient.del(`${decode.id}`);

      return deleteResult;
    } catch (err) {
      throw err; // 기타 예상치 못한 오류
    }
  },
};
