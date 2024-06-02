import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './reset.css'
import './globals.css'
import Image from 'next/image'

export const runtime = 'edge'
export const metadata = {
  title: 'Exercise stats',
  description: 'Get elevation & distance stats from Strava activities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <div>{children}</div>
          <div className="footer">
            <Image
              src="/api_logo_pwrdBy_strava_horiz_light.svg"
              className="m-auto"
              width={107}
              height={20}
              alt="Powered by Strava"
            />
            &copy; Spathon | <a href="https://github.com/spathon/StravaStats">Code</a>
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
