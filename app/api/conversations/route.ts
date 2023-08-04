import getCurrentUser from '@/app/actions/getCurrentUser';
import Prisma from '@/app/libs/prismadb';
import { resultHandler } from '../util';
import { User } from '.prisma/client';

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return resultHandler(null, 401, 'Unauthorized')
    }

    if (!(currentUser as User)?.id || !(currentUser as User)?.email) {
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
                id: (currentUser as User)?.id
              }
            ]
          }
        },
        include: {
          users: true
        }
      });
      
      return resultHandler(newConversation)
    }

    const singleConversation = await Prisma.conversation.findFirst({
      where: {
        userIds: { 
          hasEvery: [(currentUser as User)?.id, userId] 
        }
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
              id: (currentUser as User)?.id
            }
          ]
        }
      },
      include: {
        users: true
      }
    });

    return resultHandler(newConversation)


  } catch(err: any) {
    return resultHandler(null, 500, `Server Error: ${err.message}`)
  }
}