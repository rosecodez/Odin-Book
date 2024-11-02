import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [signupError, setSignupError] = useState('');

    const signupUser = async (credentials) => {
        try {
            const response = await fetch("http://localhost:3000/users/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setSignupError(data.message);
                return;
            }
    
            console.log("Signup successful:", data);
            navigate("/profile");
        } catch (error) {
            console.error("Signup error:", error);
            setSignupError("An unexpected error occurred.");
        }
    };

    const onSubmit = (data) => {
        setSignupError('');
        signupUser(data);
    };

    return (
        <div className='w-full max-w-xs'>
            <div id="signup-container" className='text-[14px] pt-5 flex items-center justify-center gap-2'>
                <h6>Already have an account?</h6>
                <a href='/login' className='text-slate-400'>Log in</a>
            </div>

            <form id="signup-form" className='flex flex-col bg-white rounded px-8 pt-6 pb-8 mb-4' onSubmit={handleSubmit(onSubmit)}>
                <input className='mt-1 block w-full px-3 py-2 mb-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]' type="text" name="username" {...register("username", { required: true })} placeholder="Username" />
                {errors.username && <span className='pt-2' style={{ color: "red" }}>Username is required. Minimum 6 letters</span>}
                
                <input className='mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 w-[270px]' type="password" name="password" {...register("password", { required: true })} placeholder="Password" />
                {errors.password && <span className='pt-2' style={{ color: "red" }}>Password is required. Minimum 10 letters</span>}

                {signupError && <span className='pt-4' style={{ color: "red" }}>{signupError}</span>}
                
                <button className='mt-6 bg-blue-500 hover:bg-indigo-600 text-white font-bold mb-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center w-[100px]' type="submit">Sign Up</button>
            </form>
        </div>
    );
}
