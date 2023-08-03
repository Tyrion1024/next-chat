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
      name,
      password
    } = body;
  
    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }
  
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    });

    return NextResponse.json(user)
  } catch(err: any) {
    return new NextResponse('Server Error', { status: 500, statusText: err.message })
  }

}