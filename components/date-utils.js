export function formatDistanceToNow(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 0) return "только что";
  
  const intervals = [
    { label: "год", seconds: 31536000, threshold: 5 },
    { label: "месяц", seconds: 2592000, threshold: 11 },
    { label: "день", seconds: 86400, threshold: 6 },
    { label: "час", seconds: 3600, threshold: 23 },
    { label: "минуту", seconds: 60, threshold: 59 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      if (count === 1) {
        return `${count} ${interval.label} назад`;
      }
      let label = interval.label;
      if (label === "минуту") label = "минут";
      if (label === "час") label = "часов";
      if (label === "день") {
        if (count % 10 === 1 && count % 100 !== 11) label = "день";
        else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) label = "дня";
        else label = "дней";
      }
      if (label === "месяц") {
        if (count % 10 === 1 && count % 100 !== 11) label = "месяц";
        else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) label = "месяца";
        else label = "месяцев";
      }
      if (label === "год") {
        if (count % 10 === 1 && count % 100 !== 11) label = "год";
        else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) label = "года";
        else label = "лет";
      }
      
      return `${count} ${label} назад`;
    }
  }
  
  return "только что";
}