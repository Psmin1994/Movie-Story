// CustomArrow.jsx
import React from "react";

// 이미지 import
import leftArrow from "assets/icons/arrow/left-arrow-56px.png";
import rightArrow from "assets/icons/arrow/right-arrow-56px.png";

const CustomArrow = (props) => {
  const { className, style, direction, onClick } = props;

  return (
    <>
      <img
        className={className}
        style={{
          ...style,
        }}
        onClick={onClick}
        src={direction === "left" ? leftArrow : rightArrow}
        alt={`${direction === "left" ? "left-arrow" : "right-arrow"}`}
      />
    </>
  );
};

export default CustomArrow;
