import { NextPrayerInfo, PrayerTimes } from '../types/masjid';

export interface MonthlyPrayerDay {
  day: number;
  dateStr: string;
  hijriStr: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export const FALLBACK_PRAYER_TIMES: PrayerTimes = {
  imsak: '04:35',
  subuh: '04:45',
  terbit: '05:58',
  dzuhur: '12:08',
  ashar: '15:18',
  maghrib: '18:12',
  isya: '19:21',
};

// Fetch real-time prayer schedule from Aladhan API with Kemenag method
export async function fetchLivePrayerTimes(latitude = 0.8755248, longitude = 117.1679831): Promise<{
  timings: PrayerTimes;
  dateMasehi: string;
  dateHijri: string;
}> {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar',
  };
  const dateMasehi = new Intl.DateTimeFormat('id-ID', options).format(now);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=20`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json && json.data && json.data.timings) {
      const t = json.data.timings;
      const cleanTime = (str: string) => str.split(' ')[0].substring(0, 5);

      const timings: PrayerTimes = {
        imsak: cleanTime(t.Imsak || '04:35'),
        subuh: cleanTime(t.Fajr || '04:45'),
        terbit: cleanTime(t.Sunrise || '05:58'),
        dzuhur: cleanTime(t.Dhuhr || '12:08'),
        ashar: cleanTime(t.Asr || '15:18'),
        maghrib: cleanTime(t.Maghrib || '18:12'),
        isya: cleanTime(t.Isha || '19:21'),
      };

      let dateHijri = '1448 H';
      if (json.data.date && json.data.date.hijri) {
        const h = json.data.date.hijri;
        dateHijri = `${h.day} ${h.month.en} ${h.year} H`;
      }

      return { timings, dateMasehi, dateHijri };
    }
  } catch {
    // Graceful fallback if offline or API blocked
  }

  return {
    timings: FALLBACK_PRAYER_TIMES,
    dateMasehi,
    dateHijri: '1448 H / Kutai Timur',
  };
}

// Compute the current active prayer and next prayer countdown
export function calculateNextPrayer(timings: PrayerTimes): {
  currentPrayer: string;
  nextPrayer: NextPrayerInfo;
} {
  const now = new Date();
  // Format current time in WITA
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Makassar',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const curHours = parseInt(parts.find((p) => p.type === 'hour')?.value || '12', 10);
  const curMinutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  const curSeconds = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);

  const currentSecondsOfDay = curHours * 3600 + curMinutes * 60 + curSeconds;

  const prayers = [
    { name: 'Imsak', time: timings.imsak },
    { name: 'Subuh', time: timings.subuh },
    { name: 'Terbit', time: timings.terbit },
    { name: 'Dzuhur', time: timings.dzuhur },
    { name: 'Ashar', time: timings.ashar },
    { name: 'Maghrib', time: timings.maghrib },
    { name: 'Isya', time: timings.isya },
  ].map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    return {
      ...p,
      secondsOfDay: h * 3600 + m * 60,
    };
  });

  // Find next prayer
  let next = prayers.find((p) => p.secondsOfDay > currentSecondsOfDay);
  let secondsRemaining = 0;

  if (next) {
    secondsRemaining = next.secondsOfDay - currentSecondsOfDay;
  } else {
    // Next is Imsak / Subuh tomorrow
    next = prayers[1]; // Subuh tomorrow
    secondsRemaining = 24 * 3600 - currentSecondsOfDay + next.secondsOfDay;
  }

  // Determine current active prayer
  let currentPrayer = 'Malam';
  for (let i = prayers.length - 1; i >= 0; i--) {
    if (currentSecondsOfDay >= prayers[i].secondsOfDay) {
      currentPrayer = prayers[i].name;
      break;
    }
  }

  const hoursLeft = Math.floor(secondsRemaining / 3600);
  const minutesLeft = Math.floor((secondsRemaining % 3600) / 60);
  const secsLeft = secondsRemaining % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const remainingText = `${pad(hoursLeft)}:${pad(minutesLeft)}:${pad(secsLeft)}`;

  return {
    currentPrayer,
    nextPrayer: {
      name: next.name,
      time: next.time,
      remainingText,
      secondsRemaining,
    },
  };
}

// Generate monthly prayer times list
export function getMonthlyCalendar(month = new Date().getMonth() + 1, year = new Date().getFullYear()): MonthlyPrayerDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: MonthlyPrayerDay[] = [];

  const baseTimings = FALLBACK_PRAYER_TIMES;

  for (let day = 1; day <= daysInMonth; day++) {
    // Minute slight variance simulating sun movement
    const shift = Math.floor(Math.sin((day / 30) * Math.PI) * 2);
    const adjust = (time: string, delta: number) => {
      const [h, m] = time.split(':').map(Number);
      let totalM = h * 60 + m + delta;
      const newH = Math.floor(totalM / 60) % 24;
      const newM = totalM % 60;
      return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
    };

    const d = new Date(year, month - 1, day);
    const dateStr = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

    list.push({
      day,
      dateStr,
      hijriStr: `${day} Syawal 1448 H`,
      imsak: adjust(baseTimings.imsak, shift),
      subuh: adjust(baseTimings.subuh, shift),
      terbit: adjust(baseTimings.terbit, shift),
      dzuhur: adjust(baseTimings.dzuhur, shift),
      ashar: adjust(baseTimings.ashar, shift),
      maghrib: adjust(baseTimings.maghrib, shift),
      isya: adjust(baseTimings.isya, shift),
    });
  }

  return list;
}
