'use client'

import { User } from ".prisma/client";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { post } from "@/app/(site)/http";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../Input";
import Image from 'next/image'
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

interface SettingsModalProps {
  currentUser: User
  isOpen?: boolean
  onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose  
}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  })

  const image = watch("image");
  const handleUpload = (result: any) => {
    if (isLoading) return
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    const { success, message } = await post('/api/users/settings', data)

    if (success) {
      onClose();
      router.refresh();
    } else {
      toast.error(message)
    }

    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <p className="mt-1 text-sm leading-5 text-gray-600">Edit your public infomation</p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input disabled={isLoading} label="Name" id="name" errors={errors} required register={register} />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium leadeing-6 text-gray-900" >Photo</label>
              <div className="mt-2 flex items-center gap-x-3">
                <Image
                  width="48"
                  height="48"
                  className="reounded-full"
                  alt="Avatar"
                  src={image || currentUser?.image || '/images/user-logo.webp'}
                />
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  uploadPreset="v6k5vg75"
                  onUpload={handleUpload}
                >
                  Change
                </CldUploadButton>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button disabled={isLoading} type="button" secondary onClick={onClose}>Cancel</Button>
            <Button disabled={isLoading} type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}


export default SettingsModal;