import { useMemo, useState } from 'react'
import styles from '../styles/Cinema.module.css'
import { filterShowtimesForDate, filterUpcoming, groupByDate, sortByTimeAsc } from '../lib/dateUtils'

export default function ScheduleView({ movies, halls, showtimes, selectedDate }) {
  const [mode, setMode] = useState('By Movie')
  const [movieId, setMovieId] = useState(movies[0]?.id || null)
  const [hallId, setHallId] = useState(halls[0]?.id || null)

  const movieOptions = useMemo(() => movies.map(m => ({ value: m.id, label: m.title })), [movies])
  const hallOptions = useMemo(() => halls.map(h => ({ value: h.id, label: h.name })), [halls])

  const byMovie = useMemo(() => showtimes.filter(s => s.movieId === movieId), [showtimes, movieId])
  const byHall = useMemo(() => showtimes.filter(s => s.hallId === hallId), [showtimes, hallId])

  const renderByMovie = () => {
    const grouped = groupByDate(byMovie)
    const todays = filterUpcoming(filterShowtimesForDate(byMovie, selectedDate))
    return (
      <div>
        <div className={styles.row} style={{ marginBottom: 12 }}>
          <select className={styles.dateButton} value={movieId || ''} onChange={e => setMovieId(e.target.value)}>
            {movieOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className={styles.sectionTitle}>Today (upcoming)</div>
        {todays.length === 0 ? <div className={styles.muted}>No upcoming showtimes today</div> : (
          <div className={styles.row}>
            {todays.sort(sortByTimeAsc).map(s => {
              const hall = halls.find(h => h.id === s.hallId)
              return <span key={`${s.date}-${s.startTime}-${s.hallId}`} className={styles.tag}>{s.startTime} • {hall?.name}</span>
            })}
          </div>
        )}
        <div className={styles.sectionTitle}>All showtimes (grouped by date)</div>
        {grouped.length === 0 ? (
          <div className={styles.emptyState}>No showtimes available</div>
        ) : (
          grouped.map(group => (
            <div key={group.date} style={{ marginBottom: 8 }}>
              <div className={styles.muted}>{group.date}</div>
              <div className={styles.row} style={{ marginTop: 6 }}>
                {group.showtimes.map(s => {
                  const hall = halls.find(h => h.id === s.hallId)
                  return <span key={`${s.date}-${s.startTime}-${s.hallId}`} className={styles.tag}>{s.startTime} • {hall?.name}</span>
                })}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  const renderByHall = () => {
    const todays = filterShowtimesForDate(byHall, selectedDate)
    const upcoming = filterUpcoming(todays)
    return (
      <div>
        <div className={styles.row} style={{ marginBottom: 12 }}>
          <select className={styles.dateButton} value={hallId || ''} onChange={e => setHallId(e.target.value)}>
            {hallOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className={styles.sectionTitle}>Today</div>
        {todays.length === 0 ? <div className={styles.muted}>No showtimes available for {selectedDate}</div> : (
          <div className={styles.row}>
            {todays.map(s => {
              const movie = movies.find(m => m.id === s.movieId)
              return <span key={`${s.date}-${s.startTime}-${s.movieId}`} className={styles.tag}>{s.startTime} • {movie?.title}</span>
            })}
          </div>
        )}
        <div className={styles.sectionTitle}>Today (upcoming)</div>
        {upcoming.length === 0 ? <div className={styles.muted}>No upcoming showtimes today</div> : (
          <div className={styles.row}>
            {upcoming.map(s => {
              const movie = movies.find(m => m.id === s.movieId)
              return <span key={`${s.date}-${s.startTime}-${s.movieId}`} className={styles.tag}>{s.startTime} • {movie?.title}</span>
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className={styles.segmented} style={{ marginBottom: 12 }}>
        {['By Movie', 'By Hall'].map(label => (
          <button
            key={label}
            className={`${styles.segmentedButton} ${mode === label ? styles.segmentedButtonActive : ''}`}
            onClick={() => setMode(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'By Movie' ? renderByMovie() : renderByHall()}
    </div>
  )
}


