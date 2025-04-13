import React, { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const LoginPage = (props) => {
  const { isOpen, closeModal } = props;

  const [mode, setMode] = useState("login");

  if (mode === "login") return <LoginModal isOpen={isOpen} closeModal={closeModal} setMode={setMode}></LoginModal>;

  if (mode === "register") return <RegisterModal isOpen={isOpen} closeModal={closeModal} setMode={setMode}></RegisterModal>;
};

export default LoginPage;
