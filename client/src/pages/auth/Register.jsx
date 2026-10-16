import React from 'react'
import signUpPageHero from '../../assets/signup/signupHero2.jpg'
import { Link } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { signUpUser } from '@/store/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'



const Register = () => {
  const schema=z.object({
    name:z.string().min(2,"Name must be longer than 2 characters"),
    email:z.string().email(),
    password:z.string().min(8,"Password must be atleast 8 characters")
  })

  const isLoading = useSelector((state)=>state.auth.isLoading)



  const {register,
    handleSubmit,
    setError,formState:{
    errors,isSubmitting}}=useForm({
      resolver:zodResolver(schema)
    })
  const dispatch =useDispatch()



 async function onSubmit(data){
    try {
      console.log(data)
       await dispatch(signUpUser(data)).unwrap()
      
    } catch (error) {
      setError('root', {
      type: 'server',
      message:
        error
    })

      
    }

  }

  return (
    <div className=' flex'>
      <div>
        <img className=' h-screen w-{40vw}' src={signUpPageHero} alt="" />

      </div>
      <div className=' h-screen w-[60vw]  flex flex-col items-center justify-center'>
        <h1 className=' font-bold text-2xl'>Create Account</h1>
        <form className='flex w-full max-w-md flex-col' onSubmit={handleSubmit(onSubmit)} action="" >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="form-name">Name</FieldLabel>
                <Input id='form-name' type='text'  placeholder='Full Name' {...register("name")} />
                {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id='email' type='email' placeholder='Email' {...register("email")} />
                {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
               <Input id='password' type='password' placeholder='password' {...register("password")} />
               {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                )}

              
            </Field>
          </FieldGroup>
         
          <Button type='submit' disabled={isLoading} >
            {isLoading? 'Creating an account ':'Create Account'}
          </Button>
          {errors.root && <div className="text-red-500">{errors.root.message}</div>}
          <p className=' flex gap-2'>
            <span>Already have an account?</span>
            <Link className=' text-blue-400 hover:underline' to='/auth/login'  >login</Link>
            
          </p>
          
         
          
        </form>


      </div>


    </div>
  )
}

export default Register