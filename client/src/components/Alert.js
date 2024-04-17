import { useAppContext } from '../context/appContext'

const Alert = () => {
  const { alertType, alertText } = useAppContext()
  return <div className={`alert alert-${alertType}`} id="arlert">{alertText}</div>
}

export default Alert
