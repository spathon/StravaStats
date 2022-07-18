import { Link, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"


export async function loader() {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: process.env.STRAVA_REDIRECT_URL,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
  })

  return {
    url: `https://www.strava.com/oauth/authorize?${params}`
  }
}


export default function Index() {
  const data = useLoaderData()
  const [hasActivities, setHasActivities] = useState(false)
  useEffect(() => {
    const jsonString = localStorage.getItem('activities')
    if (jsonString) {
      const activities = JSON.parse(jsonString)
      setHasActivities(true)
    }
  }, [])

  console.log('DATA', data)
  return (
    <div className="page text-center">
      <h1>Give me stats!</h1>
      <br />
      <br />
      {hasActivities && (
        <>
          <Link to="/activities">View stats</Link>
          {' - '}
        </>
      )}
      <a href={data.url} className="btn">Auth strava</a>
    </div>
  )
}
