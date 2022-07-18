import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";
import { useEffect } from 'react'

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  if (!searchParams.has('code')) throw new Error('Nope')

  const user = await fetch('https://www.strava.com/api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: searchParams.get('code'),
      grant_type: 'authorization_code',
    })
  }).then((resp) => resp.json())

  const resp = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.access_token}`,
    },
  })
  const activities = await resp.json()

  const athlete = {
    username: user.athlete.username,
    city: user.athlete.city,
    country: user.athlete.country,
    image: user.athlete.profile_medium,
  }

  if (resp.status !== 200) return json({ error: 'You need to approve activities to use this app' })
  return json({ activities, athlete });
};

export default function Products() {
  const { activities, athlete, error } = useLoaderData()
  useEffect(() => {
    if (error) return
    window.localStorage.setItem('activities', JSON.stringify(activities))
    window.localStorage.setItem('athlete', JSON.stringify(athlete))
    window.location.href = window.location.origin
  }, [])

  if (error) return <h1>Error: {error}</h1>

  return (<h1>Loading....</h1>)
}
