import Link from 'next/link'

export default function Authorize() {
  return (
    <div className="page text-center">
      <h1>Strava elevation stats!</h1>
      <br />
      <p>
        Authorize Strava to view elevation graph of your activities this year.
        <br />
        The data is only stored in the browser.
      </p>
      <Link prefetch={false} href="/api/auth-strava" className="btn">
        Authorize Strava
      </Link>
    </div>
  )
}
