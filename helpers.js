const USER_KEY = "instapro-user";

export function getUserFromLocalStorage() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserToLocalStorage(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUserFromLocalStorage() {
  localStorage.removeItem(USER_KEY);
}

export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} минут назад`;
  if (diffHour < 24) return `${diffHour} часов назад`;
  return `${diffDay} дней назад`;
}