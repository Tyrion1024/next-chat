'use client';

import Input from "@/app/components/Input";
import { FieldErrors, FieldValues, RegisterOptions, UseFormRegister, UseFormRegisterReturn } from "react-hook-form";


interface MessageInputProps {
  id: string
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors<FieldValues>
  required: boolean
  placeholder: string
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  register,
  errors,
  required,
  placeholder
}) => {
  return (
    <Input id={id} type="text" required={required} register={register} errors={errors} placeholder={placeholder}/>
  )
}

export default MessageInput;