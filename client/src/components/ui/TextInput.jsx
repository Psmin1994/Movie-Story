import * as React from "react";
import { TextField } from "@mui/material";
import styled from "styled-components";
// import { styled } from "@mui/material/styles";

const StyledTextInput = styled(TextField)`
  width: 100%;
  font-size: 1rem;
  line-height: 20px;
`;

const TextInput = (props) => {
  const { rows, addStyle, value, onChange, placeholder } = props;

  return (
    <>
      <StyledTextInput
        value={value}
        style={addStyle}
        onChange={onChange}
        id="content"
        label={placeholder}
        multiline={rows > 1 && true}
        rows={rows}
        variant="filled"
      />
    </>
  );
};

export default TextInput;
