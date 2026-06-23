import React, { useState } from "react";
import { Link } from "react-router-dom";
import BaseInput from "../base/baseInput";
import BaseButton from "../base/baseButton";
import { ROUTES } from "../constants/route.constant";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${mode === "login" ? "Login" : "Register"} submitted: ${email}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center text-sm font-medium text-gray-600 leading-4.5">
        {mode === "login" && "Log in to continue"}
        {mode === "register" && "Sign up to continue"}
      </div>

      <form onSubmit={handleSubmit} className="space-y-1">
        <div>
          <BaseInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onClear={() => setEmail("")}
            align="center"
          />
        </div>
        <BaseButton type="submit" className="w-full">
          Continue
        </BaseButton>
      </form>

      <div className="text-center text-xs mt-1">
        {mode === "login" && (
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        )}
        {mode === "register" && (
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
