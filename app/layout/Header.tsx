import { Link } from '@remix-run/react'


export default function Header({ user }) {
  const clearData = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="header">
      <div className="logo">My stats</div>
      <div>
        {user?.username
          ? (
            <span>
              Hello, {user?.username}!
              {' '}<Link to="/api/auth-strava">Update data</Link>
              {' '}<button type="button" onClick={clearData}>Logout</button>
            </span>
          ) : <Link to="/api/auth-strava">Login with Strava</Link>
        }
      </div>
    </div>
  )
}


