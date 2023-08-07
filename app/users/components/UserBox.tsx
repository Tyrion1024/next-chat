'use client'

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { post } from "@/app/http"

import { User } from ".prisma/client"
import { toast } from "react-hot-toast"
import Avatar from "@/app/components/Avatar"
interface UserBoxProps {
  data: User
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {

  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true)

    const res = await post('/api/conversations', {
      userId: data.id
    })

    if (res.success) {
      router.push(`/conversations/${res.data.id}`)
    } else {
      toast.error(res.message);
    }

    setIsLoading(false)
  }, [data, router])

  return (
    <div
      onClick={handleClick}
      className="
        w-full
        relative
        flex
        items-center
        space-x-3
        bg-white
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      "
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBox;