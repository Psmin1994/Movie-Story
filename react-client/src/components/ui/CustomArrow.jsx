// CustomArrow.jsx
import React from "react";

// 이미지 import
import leftArrow from "assets/icons/arrow/left-arrow-56px.png";
import rightArrow from "assets/icons/arrow/right-arrow-56px.png";
import leftArrow40 from "assets/icons/arrow/left-arrow-40px.png";
import rightArrow40 from "assets/icons/arrow/right-arrow-40px.png";

const CustomArrow = (props) => {
  const { className, style, direction, size = null, onClick } = props;

  return (
    <>
      <img
        className={className}
        style={{
          ...style,
        }}
        onClick={onClick}
        src={size ? (direction === "left" ? leftArrow40 : rightArrow40) : direction === "left" ? leftArrow : rightArrow}
        alt={`${direction === "left" ? "left-arrow" : "right-arrow"}`}
      />
    </>
  );
};

export default CustomArrow;
