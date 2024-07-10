import path from "path";
import fs from "fs";
import axios from "axios";

let dirname = import.meta.dirname;

var getImgUrl = async (imgUrl, imgName, imgPath) => {
  try {
    let newPath = `${dirname}/../src/public/img/movie/` + `${imgPath}`.replaceAll(":", "-");

    let newName = imgName.replaceAll(":", "-").replaceAll("/", "_");

    if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });

    const imgResult = await axios.get(imgUrl, {
      responseType: "arraybuffer",
    });

    let extension = imgUrl.slice(imgUrl.lastIndexOf(".") - imgUrl.length);

    const newImgUrl = path.normalize(`${newPath}/${newName}${extension}`);

    await fs.writeFileSync(newImgUrl, imgResult.data);

    return newImgUrl;
  } catch (err) {
    throw err;
  }
};

export default getImgUrl;
