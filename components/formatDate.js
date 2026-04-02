import { formatDistanceToNow } from "../node_modules/date-fns/formatDistanceToNow.js";
import { ru } from "../node_modules/date-fns/locale/ru.js";

export function formatDate(date) {
  return formatDistanceToNow(new Date(date), {
    locale: ru,
    includeSeconds: true,
    addSuffix: true,
  });
}
