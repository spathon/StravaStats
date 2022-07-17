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

  const activities = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.access_token}`,
    },
  }).then((resp) => resp.json())

  return json(activities);
};

export default function Products() {
  const activities = useLoaderData();
  console.log(activities)
  useEffect(() => {
    window.localStorage.setItem('activities', JSON.stringify(activities))
  }, [])

  return (
    <div>
      <h1>Products</h1>

    </div>
  );
}
