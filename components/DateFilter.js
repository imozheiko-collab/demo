import { getNextSevenDays } from '../lib/dateUtils'
import styles from '../styles/Cinema.module.css'

export default function DateFilter({ selectedDate, onChange }) {
  const days = getNextSevenDays()
  return (
    <div className={styles.dateFilter}>
      {days.map(d => (
        <button
          key={d}
          className={`${styles.dateButton} ${selectedDate === d ? styles.dateButtonActive : ''}`}
          onClick={() => onChange(d)}
        >
          {d}
        </button>
      ))}
    </div>
  )
}


