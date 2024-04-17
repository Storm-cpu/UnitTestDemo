import { useAppContext } from '../context/appContext'
import StatItem from './StatItem'
import { FaFileAlt , FaCalendarCheck, FaRegTimesCircle  } from 'react-icons/fa'
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
  const { stats } = useAppContext()

  const defaultStats = [
    {
      title: 'đang chờ xử lý',
      count: stats.pending || 0,
      icon: <FaFileAlt  />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'đã lên lịch ',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'đã từ chối',
      count: stats.declined || 0,
      icon: <FaRegTimesCircle  />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ]

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />
      })}
    </Wrapper>
  )
}

export default StatsContainer
