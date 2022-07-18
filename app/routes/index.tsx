import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"


export default function Index() {
  const [hasActivities, setHasActivities] = useState(false)
  useEffect(() => {
    const jsonString = localStorage.getItem('activities')
    if (jsonString) {
      JSON.parse(jsonString)
      setHasActivities(true)
    }
  }, [])

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
      <Link to="/api/auth-strava" className="btn">Auth strava</Link>
    </div>
  )
}
