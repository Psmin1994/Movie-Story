import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

// 이미지 URL 처리하는 유틸 함수
export const getImgUrl = async (
  imgUrl: string,
  imgName: string,
  imgPath: string,
  subDir?: string,
  index?: number,
): Promise<string> => {
  // const __filename = new URL(import.meta.url).pathname.replace(
  //   /^.*?([A-Za-z]:)/,
  //   '$1',
  // );
  // const __dirname = path.dirname(__filename);
  const __dirname = path.resolve();

  try {
    const replacements = {
      ':': '-',
      '%': '_percent',
      '/': '_',
      '?': '',
      '"': '', // 큰따옴표 처리
      "'": '', // 작은따옴표 처리
      ' ': '_',
    };

    // 생성될 이미지 파일명
    let newName = imgName.replaceAll(
      /[:%/?"']/g,
      (match) => replacements[match] || match,
    );

    // 저장될 이미지 경로
    let newPath = `img/${imgPath}`;

    if (subDir) {
      newPath += `/${newName}/${subDir}`;
    }

    if (index) {
      newName += `_${index}`;
    }

    // 경로 중 존재하지 않는 폴더 생성
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(path.join(__dirname, 'public', newPath), {
        recursive: true,
      });
    }

    // 이미지 가져오기
    const imgResult = await axios.get(imgUrl, {
      responseType: 'arraybuffer',
    });

    // 확장자 추출
    let extension = imgUrl.slice(imgUrl.lastIndexOf('.') - imgUrl.length);

    // 생성될 이미지 최종 경로
    const newImgUrl = path.normalize(`${newPath}/${newName}${extension}`);

    // 이미지 생성
    await fs.writeFileSync(
      path.join(__dirname, 'public', newImgUrl),
      imgResult.data,
    );

    // 이미지 경로 반환
    return 'http://localhost:5000/' + newImgUrl;
  } catch (err) {
    return 'http://localhost:5000/img/empty.png';
  }
};
