import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
// Имортируем массив данных 'posts' и функцию навигации 'goToPage'
import { posts, user, goToPage } from "../index.js";
import { likePost, dislikePost } from "../api.js";
// Подключаем импорт из библиотеки date-fns для локализации
import formatDistanceToNow from
  "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/formatDistanceToNow/index.js";

import ru from
  "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/ru/index.js";

export function renderPostsPageComponent({ appEl }) {
  // Удоляем статику
  const postsHtml = posts.map((post) => {
    
    // Вычисляем сколько времени прошло с момента создания поста до текущего
    const createDate = post.createdAt
  ? formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: ru,
    })
  : "только что";


    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${createDate}
        </p>
      </li>`;
  }).join(""); // Превращаем массив строк в одну сплошную HTML-строку

  // Вставляем сгенерированный список в общую оболочку страницы
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  // Шапка одна для всех страниц
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчик кликов на лайки
  for (let button of document.querySelectorAll(".like-button")) {
    button.addEventListener("click", () => {
      if (!user) {
        alert("Чтобы поставить лайк, нужна аторизация");
        return;
      }

      const postId = button.dataset.postId;
      const post = posts.find((p) => p.id === postId);

      // Если лайк есть то удаляем или ставим
      const apiFunction = post.isLiked ? dislikePost : likePost;

      const oldIsLiked = post.isLiked;
      const oldLikes = [...post.likes];

      // Перерисовываем страницу
      renderPostsPageComponent({ appEl });

      // Отправляем запрос на сервер
      apiFunction({
        token: `Bearer ${user.token}`,
        postId,
      })
      .then((data) => {
        const updatedPost = data.post || data;
        // Сохраняем данные с сервера
        post.likes = updatedPost.likes || [];
        post.isLiked = updatedPost.isLiked;
        // И опять перерисовываем
        renderPostsPageComponent({ appEl });
      })
      .catch((error) => {
        console.error("Ошибка при работе с лайком:", error);
        // Если ошибка 
        renderPostsPageComponent({ appEl });
        alert("Не удалось обработать лайк.");
      });
    });
  }

  // Обработчик кликов на заголовки постов
  // goToPage при клике на заголовок дожны попасть в профиль автора
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}