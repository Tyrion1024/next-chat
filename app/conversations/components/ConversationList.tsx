'use client'

import useConversation from '@/app/hooks/useConversation'
import type { FullConversationType } from '@/app/types'
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx'
import { useState } from 'react'
import ConversationItem from './ConversationItem'
import GroupChatModal from './GroupChatModal';
import { User } from '@prisma/client';

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users
}) => {

  const [ items, setItems ] = useState(initialItems)

  const { conversationId, isOpen } = useConversation();

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <GroupChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} users={users}/>
      <aside
        className={clsx(`
          fixed
          left-20
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