import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";
import { LoginFormInputs } from "../interfaces";

const LoginForm: React.FC  = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>();
  const [loginError, setLoginError] = useState<string>("");
  const navigateTo = useNavigate();

  const isVisitor = watch("isVisitor");

  const loginUser = async (credentials: LoginFormInputs | { visitor: true }) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(`Login failed: ${data.message}`);
        navigateTo("/login");
        return;
      }

      navigateTo("/");
      window.location.reload();
    } catch (error) {
      console.error("Error logging in:", error.message);
      setLoginError("An error occurred. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setLoginError("");

    if (data.isVisitor) {
      loginUser({ visitor: true });
      navigateTo("/");
    } else {
      loginUser(data);
      navigateTo("/profile");
    }
  };

  return (
    <div className="w-full max-w-xs shadow-md p-4">
      <div
        id="login-container"
        className="text-[14px] pt-5 flex justify-center gap-2"
      >
        <h6>Don't have an account?</h6>
        <Link to="/signup" className="link link-primary hover:underline">
          <p>Sign up</p>
        </Link>
      </div>

      <form
        id="login-form"
        className="flex flex-col bg-base-100 rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="mt-1 block w-full px-3 py-2 mb-2 bg-base-100 border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]"
          type="text"
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
          <span style={{ color: "red" }}>Username is required</span>
        )}

        <input
          className="mt-1 block w-full px-3 py-2 bg-base-100 border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]"
          type="password"
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
          <span style={{ color: "red" }}>Password is required</span>
        )}

        {loginError && (
          <span className="pt-4" style={{ color: "red" }}>
            {loginError}
          </span>
        )}

        <label htmlFor="isVisitor" className="pt-[20px]">
          Visitor
        </label>
        <input type="checkbox" {...register("isVisitor")} />

        <button
          className="mt-4 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center w-[100px]"
          type="submit"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
