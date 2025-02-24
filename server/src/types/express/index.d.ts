// types/express/index.d.ts
import "express"; // express 타입 선언 불러오기

declare global {
  namespace Express {
    // 사용자(User) 인터페이스에 원하는 속성을 추가합니다.
    interface User {
      id: string;
      provider?: string;
      nickname?: string;
      // 필요에 따라 다른 프로퍼티 추가 가능

      [key: string]: any; // 추가적인 프로퍼티 허용
    }

    // Request 인터페이스에 user 속성이 있다는 것을 명시합니다.
    interface Request {
      user?: User;
    }
  }
}
