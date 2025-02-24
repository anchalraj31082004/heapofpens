"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import authService from "@/appwrite/auth";
import { login } from "@/lib/features/authSlice";
import Link from "next/link";
import { Button, Input } from "@/components";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          console.log(userData);
          dispatch(login(userData));
          router.push("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className='mb-2 flex justify-center'>
          <span className='inline-block w-full max-w-[100px]'>
            H-O-P
          </span>
        </div>
        <h2 className='text-center text-2xl font-bold leading-tight'>
          Sign up to create account
        </h2>
        <p className='mt-2 text-center text-base text-black'>
          Already have an account?&nbsp;
          <Link
            href='/login'
            className='font-medium text-primary transition-all duration-200 hover:underline'
          >
            Sign In
          </Link>
        </p>
        {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className='space-y-5'>
            <Input
              label='Full Name: '
              placeholder='Enter your full name'
              {...register("name", {
                required: true,
              })}
            />
            <Input
              label='Email: '
              placeholder='Enter your email'
              type='email'
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label='Password: '
              type='password'
              placeholder='Enter your password'
              {...register("password", {
                required: true,
              })}
            />
            <Button type='submit' className='w-full'>
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
