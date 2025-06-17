import React from "react";
import LoginForm from "../components/auth/RegisterForm";
import RegisterForm from "../components/auth/RegisterForm";

const authRoutes = [
  {
    name: "Login",
    layout: "/auth",
    path: "login",
    component: <LoginForm />,
  },
  {
    name: "Register",
    layout: "/auth",
    path: "register",
    component: <RegisterForm />,
  },
];

export default authRoutes; 