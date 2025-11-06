import styles from '../styles/Cinema.module.css'

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className={styles.tabs}>
      {tabs.map(t => (
        <button
          key={t}
          className={`${styles.tabButton} ${active === t ? styles.tabButtonActive : ''}`}
          title={`Go to ${t}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  )
}


