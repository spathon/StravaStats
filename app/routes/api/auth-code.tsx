import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";
import { useEffect } from 'react'


export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  if (!searchParams.has('code')) return json({ error: 'Ah ah ah, you didn\'t say the magic word' })

  const userBlob = await fetch('https://www.strava.com/api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: searchParams.get('code'),
      grant_type: 'authorization_code',
    })
  })
  const userResp = await userBlob.json()
  if (userBlob.status !== 200) return json({ error: 'Could not get user' })

  const resp = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userResp.access_token}`,
    },
  })
  const activities = await resp.json()

  const user = {
    username: userResp.athlete.username,
    city: userResp.athlete.city,
    country: userResp.athlete.country,
    image: userResp.athlete.profile_medium,
  }

  if (resp.status !== 200) return json({ error: 'You need to approve activities to use this app' })
  return json({ activities, user });
};


export default function SetUserData() {
  const { activities, user, error } = useLoaderData()
  useEffect(() => {
    if (error) return
    window.localStorage.setItem('activities', JSON.stringify(activities))
    window.localStorage.setItem('user', JSON.stringify(user))
    window.location.href = window.location.origin
  }, [])

  return (
    <div className="page text-center">
      {error
        ? (
          <>
            <h1>Error!</h1>
            <h2>{error}</h2>
          </>
        )
        : <h1>Loading...</h1>
      }
    </div>
  )
}
