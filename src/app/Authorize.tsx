import Image from 'next/image'
import Link from 'next/link'

export default function Authorize() {
  return (
    <div className="page text-center">
      <h1>Strava elevation stats!</h1>
      <br />
      <p>
        Authorize Strava to view elevation graph of your activities this year.
        <br />
        <small className="desc">The data is only stored for 5 or until logging out.</small>
      </p>
      <Link prefetch={false} href="/api/auth-strava" className="auth-btn">
        <Image className="m-auto" src="/btn_strava_connectwith_orange.svg" width={193} height={48} alt="Authorize Strava" />
      </Link>
    </div>
  )
}
