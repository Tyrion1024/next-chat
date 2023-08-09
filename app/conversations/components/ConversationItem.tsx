'use client'

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import clsx from "clsx"
import type { FullConversationType } from "@/app/types"
import useOtherUser from "@/app/hooks/useOtherUser"
import { User } from "@prisma/client"
import Avatar from "@/app/components/Avatar"
import { format } from 'date-fns';
import AvatarGroup from "@/app/components/AvartarGroup"

interface ConversationItemProps {
  data: FullConversationType
  selected?: boolean
}

const ConversationItem: React.FC<ConversationItemProps> = ({ data, selected = false }) => {

  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter()

  const lastMessage = useMemo(() => {
    const messages = data.message || []
    return messages[messages.length - 1]
  }, [data.message])


  const userEmail = useMemo(() => {
    return session?.data?.user?.email
  }, [session?.data?.user?.email])


  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) return false

    return (lastMessage.seen || []).filter((user : User) => user.email === userEmail).length !== 0

  }, [lastMessage, userEmail])


  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return '[photo]';

    if (lastMessage?.body) return lastMessage.body

    return 'Started a conversation'

  }, [lastMessage])

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data.id, router])


  return (
    <div
      onClick={handleClick}
      className={clsx(`
        w-full
        relative
        flex
        px-3
        py-2
        items-center
        space-x-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      `,
        selected ? 'bg-neutral-100': 'bg-white'
      )}
    >
      {
        data?.isGroup ? <AvatarGroup users={data.users} /> : <Avatar user={otherUser} />
      }
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">{data.name || otherUser.name}</p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray400 font-light">{format(new Date(lastMessage.createdAt), 'p')}</p>
            )}
          </div>
          <p className={clsx(`
            truncate
            text-sm
          `,
            hasSeen ? 'text-gray-500' : 'text-[#F94C31] font-bold'
          )}>{lastMessageText}</p>
        </div>
      </div>
    </div>
  )
}

export default ConversationItem;