'use client'

import { getWeek, getMonth } from 'date-fns'
import { useMemo, useState } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'

const stacks = [
  { key: 'e_1', color: '#5dcafa' },
  { key: 'e_2', color: '#82ca9d' },
  { key: 'e_3', color: '#ff5f6b' },
  { key: 'e_4', color: '#8884d8' },
  { key: 'e_5', color: '#18f4d8' },
  { key: 'e_6', color: '#5584f8' },
  { key: 'e_7', color: '#5dcafa' },
  { key: 'e_8', color: '#82ca9d' },
  { key: 'e_9', color: '#ff5f6b' },
  { key: 'e_10', color: '#8884d8' },
  { key: 'e_11', color: '#18f4d8' },
  { key: 'e_12', color: '#5584f8' },
  { key: 'e_13', color: '#5dcafa' },
  { key: 'e_14', color: '#82ca9d' },
  { key: 'e_15', color: '#ff5f6b' },
  { key: 'e_16', color: '#8884d8' },
  { key: 'e_17', color: '#18f4d8' },
  { key: 'e_18', color: '#5584f8' },
  { key: 'e_19', color: '#5dcafa' },
  { key: 'e_20', color: '#82ca9d' },
  { key: 'e_21', color: '#ff5f6b' },
  { key: 'e_22', color: '#8884d8' },
  { key: 'e_23', color: '#18f4d8' },
  { key: 'e_24', color: '#5584f8' },
]
const getColor = (key) => stacks.find((s) => s.key === key)?.color || ''

function Gradient({ id, color }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={color} stopOpacity={0.5} />
    </linearGradient>
  )
}

function WeekTip({ payload, label, measure }) {
  return (
    <div className="weektip">
      <table className="table">
        <tbody>
          {payload
            .slice()
            .reverse()
            .map((bar, index) => (
              <tr
                key={bar.name}
                className="weektip__activity"
                style={{ color: getColor(bar.name) }}
              >
                <td className="activity_name">{bar?.payload?.activities?.[index]?.name}</td>
                <td>
                  {bar?.payload?.[bar.name]}
                  <span className="meta"> {measure}</span>
                </td>
              </tr>
            ))}
          <tr>
            <th>Total</th>
            <th className="weektip__total">
              {payload?.[0]?.payload?.total}
              <span className="meta"> {measure}</span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function MyBar({ weeks, measure }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart barCategoryGap="1%" data={weeks}>
        <defs>
          {stacks.map(({ key, color }) => (
            <Gradient key={key} id={key} color={color} />
          ))}
        </defs>
        <XAxis dataKey="weekNr" />
        <CartesianGrid strokeDasharray="1 3" />
        <YAxis tickFormatter={(val) => `${val} ${measure}`} />
        <Tooltip cursor={{ opacity: 0.2 }} content={<WeekTip measure={measure} />} />
        {stacks.map(({ key, color }) => (
          <Bar key={key} dataKey={key} stackId="a" fill={`url(#${key})`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function Activities({ activities }) {
  const [type, setType] = useState('elevation')
  const [time, setTime] = useState('weeks')
  const measure = useMemo(() => (type === 'elevation' ? 'm' : 'km'), [type])
  const isWeeks = time === 'weeks'
  const today = new Date()

  const thisWeek = isWeeks ? getWeek(new Date(), { weekStartsOn: 1 }) : getMonth(new Date()) + 1
  const weeks = Array(thisWeek)
    .fill()
    .map((val, index) => ({
      weekNr: index + 1,
      total: 0,
      activities: [],
    }))

  // console.log(activities)
  activities
    .filter((event) => new Date(event.start_date).getFullYear() === today.getFullYear())
    .filter(
      (event) => event.type === 'Run' || event.type === 'Hike' || event.type === 'BackcountrySki'
    )
    // .filter((event) => event.total_elevation_gain > 100 && event.total_elevation_gain < 3000)
    .map((event) => ({
      name: event.name,
      startDate: new Date(event.start_date),
      elevation: Math.round(event.total_elevation_gain),
      distance: Math.round((event.distance / 1000 + Number.EPSILON) * 10) / 10,
    }))
    .forEach((event) => {
      const weekNr = isWeeks
        ? getWeek(event.startDate, { weekStartsOn: 1 })
        : getMonth(event.startDate) + 1
      const week = weeks.find((w) => w.weekNr === weekNr)
      week.activities.unshift(event)
      week[`e_${week.activities.length}`] = event[type]
      week.total += event[type]
    })

  return (
    <div className="page page--wide">
      <h1 className="text-center">Activities {type}</h1>

      <div className="options">
        <div className="select-type">
          <label>
            <input
              type="radio"
              checked={time === 'weeks'}
              name="time"
              onChange={() => setTime('weeks')}
            />{' '}
            Weeks
          </label>{' '}
          <label>
            <input
              type="radio"
              checked={time === 'months'}
              name="time"
              onChange={() => setTime('months')}
            />{' '}
            Months
          </label>
        </div>

        <div className="select-type">
          <label>
            <input
              type="radio"
              checked={type === 'elevation'}
              name="type"
              onChange={() => setType('elevation')}
            />{' '}
            Elevation
          </label>{' '}
          <label>
            <input
              type="radio"
              checked={type === 'distance'}
              name="type"
              onChange={() => setType('distance')}
            />{' '}
            Distance
          </label>
        </div>
      </div>

      <MyBar weeks={weeks} measure={measure} />
    </div>
  )
}
