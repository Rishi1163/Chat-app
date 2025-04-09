import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { Eye, EyeOff, Loader2, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagepattern from '../components/AuthImagepattern';
import { toast } from 'sonner';

const LoginPage = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: ""
  })
  const { login, isLoggingIn } = useAuthStore()

  const validateForm = () => {
    if (!data.email.trim()) return toast.error("Email is required!")
    if (!/\S+@\S+\.\S+/.test(data.email)) return toast.error("Invalid email format");
    if (!data.password.trim()) return toast.error("Password is required!")
    if (data.password.length < 6) return toast.error("Password must be atleast 6 characters")

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const success = validateForm()

    if (success === true) {
      login(data)
    }
  }

  const togglePassword = () => setShowPassword((prev) => !prev)  //Fixed function

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className='flex flex-col items-center gap-2 group'>
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className='size-6 text-primary' />
              </div>
            </div>
            <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
            <p className='text-base-content/60'>Get started with your free Account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email */}
            <div className="form-control">
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiMail className='size-5 text-base-content' />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder='Enter Email'  // Fixed placeholder
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiLock className="size-5 text-base-content/40" />  {/* ✅ Added missing Lock icon */}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}  // ✅ Fixed function
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
              {
                isLoggingIn ? (
                  <>
                    <Loader2 className='size-5 animate-spin' />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )
              }
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account? {" "}
              <Link to={'/signup'} className='link link-primary'>Register</Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagepattern
        title={'Join Our Community'}
        subtitle={'Connect with friends, share moments, and stay in touch with your loved ones.'}
      />
    </div>
  )
}

export default LoginPage

