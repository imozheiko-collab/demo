export function pad2(n) {
  return n.toString().padStart(2, '0');
}

export function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

export function getTodayYYYYMMDD() {
  const now = new Date();
  return formatDateYYYYMMDD(now);
}

export function getNextSevenDays() {
  const days = [];
  const start = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(formatDateYYYYMMDD(d));
  }
  return days;
}

export function toDateFromDateAndTime(dateYYYYMMDD, timeHHMM) {
  const [year, month, day] = dateYYYYMMDD.split('-').map(Number);
  const [hour, minute] = timeHHMM.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export function isShowtimeUpcoming(dateYYYYMMDD, timeHHMM) {
  const showtimeDate = toDateFromDateAndTime(dateYYYYMMDD, timeHHMM);
  const now = new Date();
  return showtimeDate >= now;
}

export function sortByTimeAsc(a, b) {
  if (a.startTime < b.startTime) return -1;
  if (a.startTime > b.startTime) return 1;
  return 0;
}

export function sortByDateAsc(a, b) {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return sortByTimeAsc(a, b);
}

export function groupByDate(showtimes) {
  const map = new Map();
  for (const s of showtimes) {
    if (!map.has(s.date)) map.set(s.date, []);
    map.get(s.date).push(s);
  }
  const entries = Array.from(map.entries()).sort(([d1], [d2]) => (d1 < d2 ? -1 : d1 > d2 ? 1 : 0));
  return entries.map(([date, sts]) => ({ date, showtimes: sts.sort(sortByTimeAsc) }));
}

export function filterShowtimesForDate(showtimes, dateYYYYMMDD) {
  return showtimes.filter(s => s.date === dateYYYYMMDD).sort(sortByTimeAsc);
}

export function filterUpcoming(showtimes) {
  return showtimes.filter(s => isShowtimeUpcoming(s.date, s.startTime));
}


