import getCurrentUser from './getCurrentUser';
import Prisma from '@/app/libs/prismadb';

export default async function getConversationById (conversationId: string) {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null
  }

  try {
    const conversation = await Prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        message: true,
        users: true
      }
    })

    return conversation
  } catch(err: any) {
    return null
  }
}