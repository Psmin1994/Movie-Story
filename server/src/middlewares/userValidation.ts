import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

const validator = (req: Request, res: Response, next: NextFunction) => {
  // validationResult 메서드를 통해 결과를 받습니다.
  let errors = validationResult(req);

  // isEmpty메소드는 express-validator 내장 메소드
  if (!errors.isEmpty()) {
    const response: Record<string, string> = {};

    // array메소드는 express-validator 내장 메소드
    for (let element of errors.array()) {
      const param = element.param;
      const msg = element.msg;

      if (param && msg) {
        // 오류 객체에 param과 msg가 모두 있을 때만 추가
        response[param] = msg;
      }
    }

    return res.status(400).json(response);
  }

  next();
};

const userValidator = {
  register: [
    body("id")
      .trim() // 양쪽 공백 제거
      .notEmpty() // 공백이 아닌지
      .withMessage("아이디를 입력해주세요") // 메세지 생성
      .bail() // 메세지 생성 시 종료
      .isLength({ min: 4, max: 12 }) // 길이 확인 메서드
      .withMessage("아이디는 4글자 이상 12글자 미만이어야합니다")
      .bail()
      .isAlphanumeric() // 영어 대소문자, 숫자 구조 확인 메서드
      .withMessage("아이디는 숫자, 영어 대소문자로 구성해주세요")
      .bail(),

    body("password")
      .notEmpty()
      .withMessage("비밀번호를 입력하세요")
      .bail()
      .isLength({ min: 4, max: 12 })
      .withMessage("비밀번호는 4글자 이상 12글자 미만이어야합니다")
      .bail()
      .matches(/[a-zA-Z]/)
      .withMessage("비밀번호는 영어를 최소 1자 이상 포함해야 합니다")
      .bail()
      .matches(/\d/)
      .withMessage("비밀번호는 숫자를 최소 1자 이상 포함해야 합니다")
      .bail()
      .matches(/[!@#$%^&*]/)
      .withMessage("비밀번호는 특수문자(!@#$%^&*)를 최소 1자 이상 포함해야 합니다")
      .bail(),

    body("confirmPassword")
      .notEmpty()
      .withMessage("비밀번호를 한번 더 입력해주세요")
      .bail()
      .custom((value: string, { req }) => {
        return value === req.body.password;
      })
      .withMessage("입력한 비밀번호와 같지 않습니다.")
      .bail(),

    body("name")
      .notEmpty()
      .withMessage("이름을 입력해주세요")
      .bail()
      .isLength({ min: 2, max: 8 })
      .withMessage("이름은 2글자 이상 8글자 미만이어야합니다")
      .bail()
      .custom((value: string) => {
        // 정규 표현식
        let checkRegExp = /^[가-힣]+$/;

        return checkRegExp.test(value);
      })
      .withMessage("이름은 한글로 구성해주세요")
      .bail(),

    validator,
  ] as ValidationChain[],
};

export default userValidator;
