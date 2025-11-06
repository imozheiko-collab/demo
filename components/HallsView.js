import { useMemo, useState } from 'react'
import styles from '../styles/Cinema.module.css'
import { filterShowtimesForDate, filterUpcoming, sortByTimeAsc, getNextSevenDays } from '../lib/dateUtils'

export default function HallsView({ movies, halls, showtimes, selectedDate }) {
  const [selectedHallId, setSelectedHallId] = useState(null)

  const showtimesByHall = useMemo(() => {
    const byHall = new Map()
    for (const s of showtimes) {
      if (!byHall.has(s.hallId)) byHall.set(s.hallId, [])
      byHall.get(s.hallId).push(s)
    }
    return byHall
  }, [showtimes])

  const renderHallItem = (h) => {
    const sts = filterUpcoming(filterShowtimesForDate(showtimesByHall.get(h.id) || [], selectedDate))
    return (
      <div key={h.id} className={styles.listItem} title={`View schedule for ${h.name}`} onClick={() => setSelectedHallId(h.id)}>
        <div>
          <strong>{h.name}</strong>
          <div className={styles.muted}>{h.capacity} seats • {h.features.join(', ')}</div>
        </div>
        <div className={styles.row}>
          {sts.length === 0 ? (
            <span className={styles.muted}>No showtimes available for {selectedDate}</span>
          ) : (
            sts.map(s => {
              const movie = movies.find(m => m.id === s.movieId)
              return <span key={`${s.date}-${s.startTime}-${s.movieId}`} className={styles.tag}>{s.startTime} • {movie?.title}</span>
            })
          )}
        </div>
      </div>
    )
  }

  const renderHallSchedule = () => {
    const hall = halls.find(h => h.id === selectedHallId)
    if (!hall) return null
    const todays = filterShowtimesForDate(showtimesByHall.get(hall.id) || [], selectedDate)
    const upcoming = filterUpcoming(todays)
    const week = getNextSevenDays()
    return (
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <strong style={{ fontSize: 18 }}>{hall.name}</strong>
            <span className={styles.tag}>{hall.capacity} seats</span>
          </div>
          <div className={styles.muted}>{hall.features.join(' • ')}</div>

          <div className={styles.sectionTitle}>Today</div>
          {todays.length === 0 ? (
            <div className={styles.muted}>No showtimes available for {hall.name} on {selectedDate}</div>
          ) : (
            <div className={styles.row}>
              {todays.map(s => {
                const movie = movies.find(m => m.id === s.movieId)
                return <span key={`${s.date}-${s.startTime}-${s.movieId}`} className={styles.tag}>{s.startTime} • {movie?.title}</span>
              })}
            </div>
          )}

          <div className={styles.sectionTitle}>Today (upcoming)</div>
          {upcoming.length === 0 ? (
            <div className={styles.muted}>No upcoming showtimes today</div>
          ) : (
            <div className={styles.row}>
              {upcoming.map(s => {
                const movie = movies.find(m => m.id === s.movieId)
                return <span key={`${s.date}-${s.startTime}-${s.movieId}`} className={styles.tag}>{s.startTime} • {movie?.title}</span>
              })}
            </div>
          )}

          <div className={styles.sectionTitle}>Week schedule</div>
          {week.map(d => {
            const dayShows = filterShowtimesForDate(showtimesByHall.get(hall.id) || [], d)
            return (
              <div key={d} style={{ marginBottom: 8 }}>
                <div className={styles.muted}>{d}</div>
                {dayShows.length === 0 ? (
                  <div className={styles.muted} style={{ marginTop: 6 }}>No showtimes available for {hall.name} on {d}</div>
                ) : (
                  <div className={styles.row} style={{ marginTop: 6 }}>
                    {dayShows.sort(sortByTimeAsc).map(s => {
                      const movie = movies.find(m => m.id === s.movieId)
                      return <span key={`${s.date}-${s.startTime}-${s.movieId}`} className={styles.tag}>{s.startTime} • {movie?.title}</span>
                    })}
                  </div>
                )}
              </div>
            )
          })}

          <div style={{ marginTop: 12 }}>
            <button className={styles.dateButton} title="Close" onClick={() => setSelectedHallId(null)}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {selectedHallId ? (
        renderHallSchedule()
      ) : (
        <div className={styles.list}>
          {halls.map(renderHallItem)}
        </div>
      )}
    </div>
  )
}


