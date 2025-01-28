import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [signupError, setSignupError] = useState("");

  const isVisitor = watch("isVisitor");

  const signupUser = async (credentials) => {
    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        setSignupError(`signup failed: ${data.message}`);
        return;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("An unexpected error occurred.");
    }
  };

  const onSubmit = async (data) => {
    setSignupError("");

    if (data.isVisitor) {
      await signupUser({ visitor: true });
      navigateTo("/");
    } else {
      await signupUser(data);
      navigateTo("/profile");
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-xs shadow-md p-4">
      <div
        id="signup-container"
        className="text-[14px] pt-5 flex justify-center gap-2 "
      >
        <h6>Already have an account?</h6>
        <a href="/login" className="text-slate-400">
          Log in
        </a>
      </div>

      <form
        id="signup-form"
        className="flex flex-col bg-white rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="mt-1 block w-full px-3 py-2 mb-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              invalid:border-pink-500 invalid:text-pink-600
              focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]"
          type="text"
          name="username"
          {...register("username", {
            validate: (value) => {
              if (!isVisitor) {
                if (!value) return "Username is required";
              }
              return true;
            },
          })}
          placeholder="Username"
        />
        {errors.username && (
          <span className="pt-2" style={{ color: "red" }}>
            {errors.username.message}
          </span>
        )}

        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]"
          type="password"
          name="password"
          {...register("password", {
            validate: (value) => {
              if (!isVisitor) {
                if (!value) return "Password is required";
                if (value.length < 10) return "Minimum 10 letters";
              }
              return true;
            },
          })}
          placeholder="Password"
        />
        {errors.password && (
          <span className="pt-2" style={{ color: "red" }}>
            {errors.password.message}
          </span>
        )}

        {signupError && (
          <span className="pt-4" style={{ color: "red" }}>
            {signupError}
          </span>
        )}

        <label htmlFor="isVisitor" className="pt-[20px]">
          Visitor
        </label>
        <input type="checkbox" name="isVisitor" {...register("isVisitor")} />

        <button
          className="mt-4 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 rounded focus:outline-none focus:shadow-outline self-center w-[100px]"
          type="submit"
        >
          Sign Up
        </button>

      </form>
      <a href="http://localhost:3000/auth/google" className="flex justify-center">
        <button className="gsi-material-button">
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">Sign in with Google</span>
          </div>
        </button>
      </a>

    </div>
  );
}
