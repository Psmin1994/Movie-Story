import crypto from "crypto";

// 암호화된 비밀번호 생성 함수
const createPasswordAndSalt = (userInputPassword) => {
  try {
    const salt = crypto.randomBytes(32).toString("base64");

    // 매개변수 : 입력값, salt, 반복 횟수, Key의 길이, 해시알고리즘
    const key = crypto.pbkdf2Sync(userInputPassword, salt, 200, 8, "sha512").toString("base64");

    return `${key}$${salt}`;
    // 암호화된 비밀번호와 임의로 생성된 salt를 '$'로 구분
  } catch (err) {
    throw err;
  }
};

// 비밀번호 검증 함수
// 사용자의 입력 값과 데이터베이스에 저장된 암호화된 값을 비교해 검증합니다.
const userPasswordVerify = (userInputPassword, storedPasswordAndSalt) => {
  try {
    const [encrypted, salt] = storedPasswordAndSalt.split("$");

    const userInputEncrypted = crypto.pbkdf2Sync(userInputPassword, salt, 200, 8, "sha512").toString("base64");

    if (userInputEncrypted === encrypted) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

export { createPasswordAndSalt, userPasswordVerify };
