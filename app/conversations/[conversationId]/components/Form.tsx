'use client';

import useConversation from "@/app/hooks/useConversation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { post } from '@/app/(site)/http';
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import { CldUploadButton } from 'next-cloudinary';
import MessageInput from "./MessageInput";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  })


  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    setValue('message', '', { shouldValidate: true })
    await post('/api/messages/send', {
      ...data,
      conversationId
    })
  }


  const handleUpload = async (result: any) => {
    setValue('message', '', { shouldValidate: true })
    await post('/api/messages/send', {
      image: result?.info?.secure_url,
      conversationId
    })
  }

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="v6k5vg75"
        onUpload={handleUpload}
      >
        <HiPhoto size={28} className="text-sky-500 cursor-pointer hover:text-sky-600" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <div className="flex-1 mt-2">
          <MessageInput id="message" register={register} errors={errors} required placeholder="Write a message." />
        </div>
        <button type='submit'>
          <HiPaperAirplane size={18} className="text-sky-500 cursor-pointer transition hover:text-sky-600" />
        </button>
      </form>
    </div>
  )
}


export default Form;