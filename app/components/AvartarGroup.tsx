'use client'

import Image from 'next/image'
import { User } from "@prisma/client"

interface AvatarGroupProps {
  users: User[]
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users
}) => {
  const sliceUsers = users.slice(0, 3)

  // const positionMap = {
  //   0: 'top-0 left-[12px]',
  //   1: 'bottom-0',
  //   2: 'bottom-0 right-0'
  // }

  const positionArr = [
    'top-0 left-[12px]',
    'bottom-0',
    'bottom-0 right-0'
  ]

  return (
    <div className="relative h-11 w-11">
      {
        sliceUsers.map((user, index) => (
          <div
            key={user.id}
            className={`
              absolute
              inline-block
              rounded-full
              overflow-hidden
              h-[21px]
              w-[21px]
              ${positionArr[index]}
          `}
          >
            <Image fill alt='Avatar' src={user?.image || '/images/user-logo.webp'}/>
          </div>
        ))
      }
    </div>
  )
}

export default AvatarGroup;