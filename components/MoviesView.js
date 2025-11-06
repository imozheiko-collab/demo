import { useMemo, useState } from 'react'
import styles from '../styles/Cinema.module.css'
import { filterShowtimesForDate, filterUpcoming, groupByDate } from '../lib/dateUtils'

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Image'

export default function MoviesView({ movies, halls, showtimes, selectedDate }) {
  const [selectedMovieId, setSelectedMovieId] = useState(null)

  const selectedMovie = useMemo(() => movies.find(m => m.id === selectedMovieId) || null, [movies, selectedMovieId])

  const showtimesByMovie = useMemo(() => {
    const byMovie = new Map()
    for (const s of showtimes) {
      if (!byMovie.has(s.movieId)) byMovie.set(s.movieId, [])
      byMovie.get(s.movieId).push(s)
    }
    return byMovie
  }, [showtimes])

  const renderMovieCard = (m) => {
    const sts = filterShowtimesForDate(showtimesByMovie.get(m.id) || [], selectedDate)
    const upcoming = filterUpcoming(sts)
    return (
      <div key={m.id} className={`${styles.card} ${styles.clickable}`} title={`View details for ${m.title}`} onClick={() => setSelectedMovieId(m.id)}>
        <img className={styles.cover} src={m.coverImage} alt={m.title} onError={(e) => { e.currentTarget.src = PLACEHOLDER }} />
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <strong>{m.title}</strong>
            <span className={styles.tag}>{m.rating}</span>
          </div>
          <div className={styles.muted}>{m.genre} • {m.durationMinutes} min</div>
          <div className={styles.sectionTitle}>Today</div>
          {upcoming.length === 0 ? (
            <div className={styles.muted}>No showtimes available for {selectedDate}</div>
          ) : (
            <div className={styles.row}>
              {upcoming.map(s => {
                const hall = halls.find(h => h.id === s.hallId)
                return <span key={`${s.date}-${s.startTime}-${s.hallId}`} className={styles.tag}>{s.startTime} • {hall?.name}</span>
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMovieDetail = () => {
    if (!selectedMovie) return null
    const sts = filterUpcoming(filterShowtimesForDate(showtimes.filter(s => s.movieId === selectedMovie.id), selectedDate))
    const grouped = groupByDate(showtimes.filter(s => s.movieId === selectedMovie.id))
    return (
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.row}>
            <strong style={{ fontSize: 18 }}>{selectedMovie.title}</strong>
            <span className={styles.tag}>{selectedMovie.rating}</span>
          </div>
          <div className={styles.muted}>{selectedMovie.genre} • {selectedMovie.durationMinutes} min</div>
          <p style={{ marginTop: 8 }}>{selectedMovie.description}</p>

          <div className={styles.sectionTitle}>Showtimes</div>
          {grouped.length === 0 ? (
            <div className={styles.emptyState}>No showtimes available for {selectedMovie.title}</div>
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

          <div className={styles.sectionTitle}>Today (upcoming)</div>
          {sts.length === 0 ? (
            <div className={styles.muted}>No upcoming showtimes today</div>
          ) : (
            <div className={styles.row}>
              {sts.map(s => {
                const hall = halls.find(h => h.id === s.hallId)
                return <span key={`${s.date}-${s.startTime}-${s.hallId}`} className={styles.tag}>{s.startTime} • {hall?.name}</span>
              })}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button className={styles.dateButton} title="Close" onClick={() => setSelectedMovieId(null)}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {selectedMovie ? (
        renderMovieDetail()
      ) : (
        <div className={styles.grid}>
          {movies.map(renderMovieCard)}
        </div>
      )}
    </div>
  )
}


