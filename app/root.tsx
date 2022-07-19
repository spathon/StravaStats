import type { MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { useEffect, useState } from 'react'
import styles from "~/styles/main.css";
import Header from './layout/Header'


export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});


export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
    { rel: "stylesheet", href: styles }
  ]
}


export default function App() {
  const [user, setUser] = useState({ state: 'LOADING' })
  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      setUser({
        state: 'LOGGED_IN',
        ...(JSON.parse(userString)),
        hasActivities: localStorage.getItem('activities'),
      })
    } else {
      setUser({ state: 'LOGGED_OUT'})
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app">
          <div>
            {user.state !== 'LOADING' && (
              <>
                <Header user={user}/>
                <Outlet />
              </>
            )}
          </div>
          <div className="footer">
            &copy; spathon | <a href="https://github.com/spathon/StravaStats">Code</a>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
