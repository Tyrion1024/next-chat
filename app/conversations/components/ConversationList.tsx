'use client'

import useConversation from '@/app/hooks/useConversation'
import type { FullConversationType } from '@/app/types'
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import ConversationItem from './ConversationItem'
import GroupChatModal from './GroupChatModal';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';
import { useRouter } from 'next/navigation';

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users
}) => {

  const router = useRouter();

  const [ items, setItems ] = useState(initialItems)

  const { conversationId, isOpen } = useConversation();

  const [isModalOpen, setIsModalOpen] = useState(false)

  const session = useSession();
  const pusherKey = useMemo(() => {
    return session?.data?.user?.email
  }, [session.data?.user?.email])

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, {id: conversation.id})) {
          return current
        }

        return [conversation, ...current]
      })
    }

    const updateHander = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            message: conversation.message
          }
        }

        return currentConversation
      }))
    }

    const deleteHander = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter(c => c.id !== conversation.id)]
      })
      if (conversationId === conversation.id) {
        router.replace('/conversations')
      }
    }

    pusherClient.subscribe(pusherKey);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHander);
    pusherClient.bind('conversation:delete', deleteHander);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:update', updateHander);
      pusherClient.unbind('conversation:delete', deleteHander);
    }
  }, [pusherKey, conversationId, router])

  return (
    <>
      <GroupChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} users={users}/>
      <aside
        className={clsx(`
          fixed
          lg:left-20
          inset-y-0
          pb-20
          lg:pb-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-gray-200
        `,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className='px-5'>
          <div className='flex justify-between mb-4 pt-4 items-center'>
            <div className='text-2xl font-bold text-neutral-800'>
              Messages
            </div>
            <div className='rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition'>
              <MdOutlineGroupAdd size={20} onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
          {
            items.map((item) => (
              <ConversationItem
                key={item.id}
                data={item}
                selected={ conversationId === item.id }
              />
            ))
          }
        </div>
      </aside>
    </>
  )
}

export default ConversationList;