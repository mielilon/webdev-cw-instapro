// Простая локальная замена formatDistanceToNow для русского языка
export function formatDistanceToNow(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 0) return "только что";

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Склонение числительных (минуты, часы, дни)
  const getNoun = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  };

  if (minutes < 1) {
    return "меньше минуты назад";
  } else if (minutes < 60) {
    return `${minutes} ${getNoun(minutes, "минуту", "минуты", "минут")} назад`;
  } else if (hours < 24) {
    return `${hours} ${getNoun(hours, "час", "часа", "часов")} назад`;
  } else {
    return `${days} ${getNoun(days, "день", "дня", "дней")} назад`;
  }
}
