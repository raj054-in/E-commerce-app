import React from 'react'
import loginPageHero from '../../assets/signup/loginHero.jpg'
import { Link } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { loginUser } from '@/store/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const Login = () => {
  const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })

  const isLoading = useSelector((state) => state.auth.isLoading)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    try {
      await dispatch(loginUser(data)).unwrap()
    } catch (error) {
      setError('root', {
        type: 'server',
        message: error,
      })
    }
  }

  return (
    <div className="flex">
      <div>
        <img className="h-screen w-[40vw] object-cover" src={loginPageHero} alt="" />
      </div>
      <div className="h-screen w-[60vw] flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl">Welcome Back</h1>
        <form className="flex w-full max-w-md flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="Email" {...register('email')} />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="Password" {...register('password')} />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </Field>
          </FieldGroup>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in' : 'Login'}
          </Button>
          {errors.root && <div className="text-red-500">{errors.root.message}</div>}
          <p className="flex gap-2">
            <span>Don't have an account?</span>
            <Link className="text-blue-400 hover:underline" to="/auth/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login