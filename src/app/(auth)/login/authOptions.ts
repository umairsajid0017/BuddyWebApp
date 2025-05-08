'use server'
import { cookies } from 'next/headers'
import { User } from '@/types/general-types'
export async function setAuthCookie(authData: User | null, token: string | null) {
  if (token) {
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
  }
  else {
    cookies().delete('token')
  }
  if (authData) {
    cookies().set('auth-storage', JSON.stringify(authData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  }
  else {
    cookies().delete('auth-storage')
  }
}