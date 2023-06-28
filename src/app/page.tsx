import { kv } from '@vercel/kv'
import { cookies } from 'next/headers'
import Activities from './Activities'
import Authorize from './Authorize'
import Header from './Header'

export default async function Home() {
  const cookieStore = cookies()
  const userId = cookieStore.get('user')
  let user = null
  if (userId && !Number.isNaN(Number(userId.value))) {
    user = (await kv.get(`user:${userId.value}`)) as AppUser
  }

  return (
    <div>
      <Header user={user} />
      {user?.id ? <Activities activities={user.activities} /> : <Authorize />}
    </div>
  )
}
