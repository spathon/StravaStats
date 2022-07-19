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
      <h1>Strava elevation stats!</h1>
      <br />
      {!hasActivities && (
        <p>
          Authorize Strava to view elevation graph of your activities this year.
          <br />
          The data is only stored in the browser.
        </p>
      )}
      {hasActivities
        ? <Link to="/activities" className="btn">View my graph</Link>
        : <Link to="/api/auth-strava" className="btn">Authorize Strava</Link>
      }
    </div>
  )
}
