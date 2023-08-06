'use client'

import { post } from "@/app/(site)/http"
import Button from "@/app/components/Button"
import Input from "@/app/components/Input"
import Modal from "@/app/components/Modal"
import Select from "@/app/components/Select"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

interface GroupChatModalProps {
  isOpen?: boolean
  onClose: () => void
  users: User[]
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  })

  const members = watch('members')

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    const { success, message } = await post('/api/conversations', {
      ...data,
      isGroup: true
    })

    if(success) {
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
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Create a chat with than 2 people.</p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input register={register} label="Name" id="name" disabled={isLoading} required errors={errors} />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name
                }))}
                onChange={(value) => setValue('members', value, {
                  shouldValidate: true
                })}
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="button" disabled={isLoading} onClick={onClose} secondary>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  )
}


export default GroupChatModal;