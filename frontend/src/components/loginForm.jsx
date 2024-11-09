import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loginError, setLoginError] = useState('');
    const navigateTo = useNavigate();

    const isVisitor = watch('isVisitor');

    const loginUser = async (credentials) => {
        try {
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });
    
            // Parse the JSON response once
            const data = await response.json();
    
            if (!response.ok) {
                setLoginError(`Login failed: ${data.message}`);
                return;
            }
    
            console.log("Login successful:", data);
            navigateTo("/profile");
            window.location.reload();
        } catch (error) {
            console.error("Error logging in:", error.message);
            setLoginError("An error occurred. Please try again.");
        }
    };
    

    const onSubmit = (data) => {
        setLoginError('');
        console.log("Form data submitted:", data);
        
        if (isVisitor) {
            navigateTo("/feed");
        } else {
            loginUser(data);
        
        }
    };
    
    return (
        <div className='w-full max-w-xs'>

            <div id="login-container" className='text-[14px] pt-5 flex items-center justify-center gap-2'>
                <h6>Don't have an account?</h6>
                <a href='/signup' className='text-slate-400'>
                    <p>Sign up</p>
                </a>
            </div>

            <form id="login-form" className='flex flex-col bg-white rounded px-8 pt-6 pb-8 mb-4' onSubmit={handleSubmit(onSubmit)}>

                <input className='mt-1 block w-full px-3 py-2 mb-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]' type="text" {...register("username", {
                        validate: (value) => {
                          if (!isVisitor) {
                            if (!value) return "Username is required";
                            if (value.length < 6) return "Minimum 6 letters";
                          }
                          return true;
                        }
                      })}
                    placeholder="Username" />
                {errors.username && <span style={{ color: "red" }}>Username is required</span>}

                <input className='mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]' type="password" {...register("password", {
                        validate: (value) => {
                          if (!isVisitor) {
                            if (!value) return "Password is required";
                            if (value.length < 10) return "Minimum 10 letters";
                          }
                          return true;
                        }
                    })}
                    placeholder="Password" />
                {errors.password && <span style={{ color: "red" }}>Password is required</span>}

                {loginError && <span className='pt-4' style={{ color: "red"}}>{loginError}</span>}
                
                <label htmlFor="isVisitor" className='pt-[20px]'>Visitor</label>
                <input type="checkbox" name="isVisitor" {...register("isVisitor")} />
                
                <button className='mt-4 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center w-[84px]' type="submit">Log in</button>
            </form>

        </div>
    );
}