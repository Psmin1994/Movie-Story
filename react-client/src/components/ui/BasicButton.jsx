import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const BasicButton = (props) => {
  const { title, addStyle, variant, onClickItem } = props;

  return (
    <>
      <StyledButton style={addStyle} variant={variant} onClick={onClickItem} size="medium">
        {title}
      </StyledButton>
    </>
  );
};

const StyledButton = styled(Button)`
  width: fit-content;
  padding: 0 10px;
  text-align: center;

  border-radius: 5px;

  color: #494949;

  font-size: 1rem;
  font-weight: 600;
  font-family: "Verdana", "Geneva", sans-serif;

  cursor: pointer;

  &:hover {
    background: #e9e9e9;
  }
`;

export default BasicButton;
