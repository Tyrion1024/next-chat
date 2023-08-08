import getCurrentUser from './getCurrentUser';
import Prisma from '@/app/libs/prismadb';

export default async function getConversationList () {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return []
  }

  try {
    const conversationList = await Prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: { 
          has: currentUser?.id 
        }
      },
      include: {
        users: true,
        message: {
          include: {
            sender: true,
            seen: true
          }
        }
      }
    })

    return conversationList
  } catch(err: any) {
    return []
  }
}