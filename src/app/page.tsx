import { kv } from '@vercel/kv'
import { cookies } from 'next/headers'
import Activities from './Activities'
import Authorize from './Authorize'
import Header from './Header'

export const runtime = 'edge'

export default async function Home() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user')
  const user = userId?.value ? ((await kv.get(`user:${userId.value}`)) as AppUser) : null

  return (
    <div>
      <Header user={user} />
      {user?.id ? <Activities activities={user.activities} /> : <Authorize />}
    </div>
  )
}
