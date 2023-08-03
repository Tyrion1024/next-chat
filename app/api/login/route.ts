import bcrypt from 'bcrypt';
import Prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';


export async function POST(
  request: Request
) {
  try {
    const body = await request.json()

    const {
      email,
      password
    } = body;
  
    if (!email || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Prisma.user.findFirst({
      where: {
        email,
      }
    });

    if (!user) {
      return new NextResponse('Account Not Found.', { status: 400, statusText: 'Account Not Found.' })
    }

    if (user?.hashedPassword !== hashedPassword) {
      return new NextResponse('Email Or Password Is Invalid.', { status: 400, statusText: 'Email Or Password Is Invalid.' })
    }

    return NextResponse.json(user)
  } catch(err: any) {
    return new NextResponse('Server Error', { status: 500, statusText: err.message })
  }

}