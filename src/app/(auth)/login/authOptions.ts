'use server'
import { User } from '@/lib/types'
import { cookies } from 'next/headers'

export async function setAuthCookie(authData: User, token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
  cookies().set('auth-storage', JSON.stringify(authData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
}