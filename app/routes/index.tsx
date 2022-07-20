import { useOutletContext } from '@remix-run/react'
import Activities from '~/views/Activities'
import Authorize from '~/views/Authorize'


export default function Index(props) {
  const { activities } = useOutletContext()

  if (activities) return <Activities activities={activities} />
  return <Authorize />
}
