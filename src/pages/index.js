import React from "react";
import AuthForm from "../components/auth/auth-form";

const auth = () => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-r from-teal-400 to-indigo-700
    "
    >
      <h2 style={{ textAlign: "center" }} className="text-lg font-bold ">
        Enter The Details To Proceed
      </h2>
      <AuthForm />
    </div>
  );
};

export default auth;
