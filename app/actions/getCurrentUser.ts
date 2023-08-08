import Prisma from '@/app/libs/prismadb';
import getSession from './getSession';


export default async function getCurrentSession() {
  
  try {
    const session = await getSession();
    if (!session?.user?.email) return null

    const currentUser = await Prisma.user.findFirst({
      where: {
        email: session.user.email
      }
    })

    return currentUser
  } catch (err: any) {
    return null
  }

}