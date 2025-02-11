import path from "path";
import fs from "fs";
import axios from "axios";

let dirname = import.meta.dirname;

var getImgUrl = async (imgUrl, imgName, imgPath) => {
  try {
    // 저장될 이미지 경로
    let newPath = `${dirname}/../src/public/img/` + `${imgPath}`.replaceAll(":", "-");

    // 생성될 이미지 파일명
    let newName = imgName.replaceAll(":", "-").replaceAll("/", "_");

    // 경로 중 존재하지 않는 폴더 생성
    if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });

    // 이미지 가져오기
    const imgResult = await axios.get(imgUrl, {
      responseType: "arraybuffer",
    });

    // 확장자 추출
    let extension = imgUrl.slice(imgUrl.lastIndexOf(".") - imgUrl.length);

    // 생성될 이미지 최종 경로
    const newImgUrl = path.normalize(`${newPath}/${newName}${extension}`);

    // 이미지 생성
    await fs.writeFileSync(newImgUrl, imgResult.data);

    // 이미지 경로 반환
    return newImgUrl;
  } catch (err) {
    throw err;
  }
};

export default getImgUrl;
