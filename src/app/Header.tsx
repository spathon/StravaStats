import Link from 'next/link'

export default function Header({ user }: { user: AppUser | null }) {
  return (
    <div className="header">
      <div className="logo">Strava stats</div>
      <div>
        {user?.username ? (
          <span>
            Hello, {user?.username}
            <Link href="/api/auth-strava">Update data</Link>
            <Link href="/api/logout">Logout</Link>
          </span>
        ) : (
          <Link href="/api/auth-strava">Login with Strava</Link>
        )}
      </div>
    </div>
  )
}
