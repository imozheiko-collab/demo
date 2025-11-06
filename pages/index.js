import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Cinema.module.css'
import Tabs from '../components/Tabs'
import DateFilter from '../components/DateFilter'
import MoviesView from '../components/MoviesView'
import HallsView from '../components/HallsView'
import ScheduleView from '../components/ScheduleView'
import { getTodayYYYYMMDD } from '../lib/dateUtils'

import moviesData from '../data/movies.json'
import hallsData from '../data/halls.json'
import showtimesData from '../data/showtimes.json'

const TABS = ['Movies', 'Halls', 'Schedule']

export default function Home() {
  const [activeTab, setActiveTab] = useState('Movies')
  const [selectedDate, setSelectedDate] = useState(getTodayYYYYMMDD())
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved)
      } else if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
        setTheme(prefersLight ? 'light' : 'dark')
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('theme', theme)
    } catch {}
  }, [theme])

  const { movies, halls, showtimes } = useMemo(() => ({
    movies: moviesData,
    halls: hallsData,
    showtimes: showtimesData
  }), [])

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <Head>
        <title>Ivan Mozheiko Demo Cinema App</title>
        <meta name="description" content="Browse movies, halls, and schedules for the next 7 days" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>Cinema Schedule Viewer</div>
          <div className={styles.row}>
            <DateFilter selectedDate={selectedDate} onChange={setSelectedDate} />
            <label
              className={styles.switch}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <input
                type="checkbox"
                className={styles.switchInput}
                aria-label="Toggle theme"
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
              <span className={styles.switchTrack} />
            </label>
          </div>
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div style={{ marginTop: 16 }}>
          {activeTab === 'Movies' && (
            <MoviesView movies={movies} halls={halls} showtimes={showtimes} selectedDate={selectedDate} />
          )}
          {activeTab === 'Halls' && (
            <HallsView movies={movies} halls={halls} showtimes={showtimes} selectedDate={selectedDate} />
          )}
          {activeTab === 'Schedule' && (
            <ScheduleView movies={movies} halls={halls} showtimes={showtimes} selectedDate={selectedDate} />
          )}
        </div>
      </main>
    </div>
  )
}

