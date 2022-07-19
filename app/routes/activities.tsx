import { useEffect, useState } from 'react'
import { getWeek } from 'date-fns'
import {
  BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer,
} from 'recharts'


const stacks = [
  { key: 'e_1', color: '#5dcafa' },
  { key: 'e_2', color: '#82ca9d' },
  { key: 'e_3', color: '#ff5f6b' },
  { key: 'e_4', color: '#8884d8' },
  { key: 'e_5', color: '#18f4d8' },
  { key: 'e_6', color: '#5584f8' },
]
const getColor = (key) => stacks.find((s) => s.key === key)?.color || ''


function Gradient({ id, color }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
      <stop offset="95%" stopColor={color} stopOpacity={0.5}/>
    </linearGradient>
  )
}


function WeekTip({ payload, label }) {
  return (
    <div className="weektip">
      <table className="table">
        <tbody>
          {payload.slice().reverse().map((bar, index) => (
            <tr key={bar.name} className="weektip__activity" style={{ color: getColor(bar.name)}}>
              <td className="activity_name">
                {bar?.payload?.activities?.[index]?.name}
              </td>
              <td>{bar?.payload?.[bar.name]}<span className="meta"> m</span></td>
            </tr>
          ))}
          <tr>
            <th>Total</th>
            <th className="weektip__total">
              {payload?.[0]?.payload?.total}<span className="meta"> m</span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


function MyBar({ weeks }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart barCategoryGap="1%" data={weeks}>
        <defs>
          {stacks.map(({ key, color }) => <Gradient key={key} id={key} color={color} />)}
        </defs>
        <XAxis dataKey="weekNr" />
        <CartesianGrid strokeDasharray="1 3" />
        <YAxis />
        <Tooltip
          cursor={{ opacity: .2 }}
          content={<WeekTip />}
        />
        {stacks.map(({ key, color }) => (
          <Bar
            key={key}
            somethning={color}
            dataKey={key}
            stackId="a"
            fill={`url(#${key})`}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}


export default function Index() {
  const [activities, setActive] = useState()
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    const gotData = localStorage.getItem('activities')
    if (gotData) {
      const things = JSON.parse(gotData)
      if (Array.isArray(things)) {
        setActive(things)
        setIsClient(true)
      }
    }
  }, [])

  if (!activities) return <div className="page text-center"><h1>Loading</h1></div>
  const thisWeek = getWeek(new Date(), { weekStartsOn: 1 })
  const weeks = Array(thisWeek)
    .fill()
    .map((val, index) => ({
      weekNr: index + 1,
      total: 0,
      activities: [],
    }))

  activities
    .filter((event) => new Date(event.start_date).getFullYear() === 2022)
    .filter((event) => event.type === 'Run' || event.type === 'Hike' || event.type === 'BackcountrySki')
    // .filter((event) => event.total_elevation_gain > 100 && event.total_elevation_gain < 3000)
    .map((event) => ({
      name: event.name,
      startDate: new Date(event.start_date),
      elevation: Math.round(event.total_elevation_gain),
    }))
    .forEach((event) => {
      const weekNr = getWeek(event.startDate, { weekStartsOn: 1 })
      const week = weeks.find((w) => w.weekNr === weekNr)
      week.activities.unshift(event)
      week[`e_${week.activities.length}`] = event.elevation
      week.total += event.elevation
    })

  return (
    <div className="page page--wide">
      <h1 className="text-center">Activities elevation</h1>
      <br />
      {isClient && <MyBar weeks={weeks} />}
    </div>
  )
}
