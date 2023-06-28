import { kv } from '@vercel/kv'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export async function GET() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user')
  if (!userId?.value) return redirect('/')

  await kv.del(`user:${userId?.value}`)

  cookies().set({
    name: 'user',
    value: '',
    expires: new Date('1999-12-31'),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })

  redirect('/')
}
