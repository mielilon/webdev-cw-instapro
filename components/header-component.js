import { goToPage, logout, user } from "../index.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";

export function renderHeaderComponent({ element }) {
  // Применяем сохранённую тему при каждом рендере шапки
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }

  const isDark = document.body.classList.contains("dark-theme");

  element.innerHTML = `
  <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button theme-toggle-button" title="Сменить тему">
        ${isDark ? "☀️ Светлая" : "🌙 Тёмная"}
      </button>
      <button class="header-button add-or-login-button">
      ${
        user
          ? `<div title="Добавить пост" class="add-post-sign"></div>`
          : "Войти"
      }
      </button>
      ${
        user
          ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
          : ""
      }  
  </div>
  `;

  // Переключатель темы
  element
    .querySelector(".theme-toggle-button")
    .addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      // Сохраняем выбор, чтобы он не сбрасывался после перезагрузки
      const nowDark = document.body.classList.contains("dark-theme");
      localStorage.setItem("theme", nowDark ? "dark" : "light");
      // Перерисовываем шапку, чтобы надпись на кнопке обновилась
      renderHeaderComponent({ element });
    });

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}