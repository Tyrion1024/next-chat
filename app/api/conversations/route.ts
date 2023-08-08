import getCurrentUser from '@/app/actions/getCurrentUser';
import Prisma from '@/app/libs/prismadb';
import { resultHandler } from '../util';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();


    if (!currentUser || !currentUser?.id || !currentUser?.email) {
      return resultHandler(null, 401, 'Unauthorized')
    }

    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name
    } = body;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return resultHandler(null, 400, 'Invalid data')
    }

    if (isGroup) {
      const newConversation = await Prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({id: member.value})),
              {
                id: currentUser?.id
              }
            ]
          }
        },
        include: {
          users: true
        }
      });
      
      newConversation.users.forEach((user => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation)
        }
      }))

      return resultHandler(newConversation)
    }

    const singleConversation = await Prisma.conversation.findFirst({
      where: {
        OR: [
          {
            userIds: { 
              equals: [currentUser?.id, userId]
            }
          },
          {
            userIds: { 
              equals: [userId, currentUser?.id]
            }
          },
        ]
      }
    })

    if (singleConversation) {
      return resultHandler(singleConversation)
    }

    const newConversation = await Prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: userId
            },
            {
              id: currentUser?.id
            }
          ]
        }
      },
      include: {
        users: true
      }
    });


    newConversation.users.forEach((user => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation)
      }
    }))

    return resultHandler(newConversation)


  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}