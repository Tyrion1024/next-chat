'use client';
import Image from "next/image"
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { post } from '../http/index';

type Variant = 'LOGIN' | 'REGISTER'

export default function AuthForm() {

  const [ variant, setVariant ] = useState<Variant>('LOGIN')
  const [ isLoading, setIsLoading ] = useState(false)


  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })


  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true)
    if (variant === 'REGISTER') {
      const { success, data, message } = await post('/api/register', body)
      if (success) {
        console.log(data)
      } else {
        toast.error(message)
        // console.log(message)
      }
    } else if (variant === 'LOGIN') {
      const { success, data, message } = await post('/api/login', body)
      if (success) {
        console.log(data)
      } else {
        toast.error(message)
        // console.log(message)
      }
    }
    setIsLoading(false)
  }

  const socialAction = (action: string) => {
    setIsLoading(true)
  }

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form
          className="spcace-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {
            variant === 'REGISTER' && (
              <Input
                label="Name"
                register={register}
                id="name"
                required={true}
                disabled={isLoading}
                errors={errors}
              />
            )
          }
          <Input
            label="Email"
            register={register}
            id="email"
            type="email"
            required={true}
            disabled={isLoading}
            errors={errors}
          />
          <Input
            label="PassWord"
            register={register}
            id="password"
            type="password"
            required={true}
            disabled={isLoading}
            errors={errors}
          />
          <div>
            <Button fullWidth={true} disabled={ isLoading } type="submit">{ variant === 'LOGIN' ? 'Sign in' : 'Register' }</Button>
          </div>
          <div className="flex relative items-center justify-center my-4">
            <div className="h-0 absolute border-solid border-t-gray-300 w-full border-t"></div>
            <span className="bg-white relative z-1 px-3 text-gray-500">Or continue with</span>
          </div>
          <div className="flex justify-center">
            <div className="w-5/12 h-7 border-gray-300 border rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <Image alt="github" width={18} height={18} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEX////4+Pi3ubtvcnZNUVU+Q0cpLjLr6+x3en0sMTYkKS59gIORk5aUl5n8/Pzw8PFTV1tbX2Pc3d5DSEzn5+g3PECLjpFKTlKFh4qxs7XCxMUwNTq/wcLh4uPV1tZzd3o/Q0jOz9CmqKpjZ2qfoaSrd37mAAABPUlEQVR4AW3TBZKEMBAF0B8GCHzcnbW5/xm30qEyknklcU/DgQpuYRTHUXgLFHw6SemkmcYrlcd8kRYlnlQ1PU0Fp434Qde75Qd+1FUQKiRZjyGfTGNjKhWMmSQXYO3Ibao3MlqBnSRzADhk/ycAdcqclSSHnEUD+KLt8KalMQMqpl3izU5jKxHQGCq8Ud80fq4VfuFZaIyQO4wVPEre5g+RrIAPJrkQSL8OPjv3htQmH8guU5uwgseeP7ITMYBnpdFgvlJPcx0zoLjjzS/FDrVRvH6xsqDYlLx29huRUaFx6YuI1mhKMbddf9trEzca7rmRk/FxpiRXiJO8FDBURyb4yfO7glC8TOpacmAc4ElMEWlc2oGckjwvYVFEB5wjouE6uLBwquypQym/scKrM4njElYaJy182q15aDj/oQMZkS8JH3IAAAAASUVORK5CYII="></Image>
            </div>
            <div className="w-5/12 h-7 rounded-md border-gray-300 border ml-6 flex justify-center items-center cursor-pointer hover:bg-gray-100">
              <Image alt="google" width={20} height={20} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEVHcEz9/f3////m6Ojw8fH9/f3////////09fX5+fnz8/Tt7u/t7u////9Bf+1LnFTbUDs7lkX7+vnYPB72uzL219MzeO3aSjP2thngaUcmc+3l7+66zffH3sqaxZ/nlYv97M2AtobkhnrrqKBAnFn40IBto1ONp0u5rDjkioSlw9qOrvNAknlznfE4nf38AAAADXRSTlMAs/FBKzJvlxqogENCbeDs1AAAAUFJREFUOI2VU9t2gyAQVGNU0lqQi0ismqTpvf3/3yt3kNhz2nlxYWaX2UWy7D8oqxqAuiq32aZuPermlo9oLUnTizZBsSqyT2mFfZRvt9giOBcLs8tQw9RngnCEEOdEGEmx9vdEkAMnLHbaBJ4TCY7IsjpEF2CKJxeGMbt43pbQoVD5sjBW4tCJb/E0CEQiIm61UsEzpeJ9YxaVs0ApHU566/hgcHx0JnIVDFKAtaC3gl4L8r8I0iN6CS+ovcmBvs3B27f0MDqTts3Xazc6fpROe9+mGdTLFUJoFVid8OkHlQEVTZ0UdPOI8Th/qS61ZRBd1qwUsJOQHzsF90eASAGN7KMNBSTMBCZoJR2cjJfwHqz76SyT4Xmyy+h93G/cU3sX/9YlTmmcvi+w5kF2gwb4KhhsPD2F3QHkOTjsttlf8ANQZSoZjCvBoAAAAABJRU5ErkJggg=="></Image>
            </div>
          </div>
          <div className="flex justify-center mt-4 text-gray-500">
            { variant === 'LOGIN' ? 'New to chat?' : 'Already have account?' }<span onClick={ toggleVariant } className="cursor-pointer underline ml-1 hover:text-gray-300">{ variant === 'LOGIN' ? 'Create an account' : 'Sign in' }.</span>
          </div>
          <div></div>
        </form>
      </div>
    </div>
  )
}