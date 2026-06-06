import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { formatDistanceToNow } from "./date-fns-local.js";
// Добавили в деструктуризацию getToken для авторизации лайков и renderApp для обновления интерфейса
import { posts, goToPage, getToken, renderApp } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org
   */

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${posts
                    .map((post) => {
                      // 1. БЕЗОПАСНОЕ ФОРМАТИРОВАНИЕ ДАТЫ
                      let formattedDate = "Только что";
                      try {
                        if (post.createdAt) {
                          formattedDate = formatDistanceToNow(
                            new Date(post.createdAt),
                          );
                        }
                      } catch (e) {
                        console.error("Ошибка даты:", e);
                        formattedDate = "Недавно";
                      }

                      // 2. ЗАЩИТА ОТ БИТЫХ ССЫЛОК
                      const userAvatar =
                        post.user.imageUrl === "https://image.png" ||
                        post.user.imageUrl === "http://image.png"
                          ? ""
                          : post.user.imageUrl;

                      const postImage =
                        post.imageUrl === "https://image.png" ||
                        post.imageUrl === "http://image.png"
                          ? ""
                          : post.imageUrl;

                      return `
                      <li class="post">
                        <div class="post-header" data-user-id="${post.user.id}">
                            <img src="${userAvatar}" class="post-header__user-image">
                            <p class="post-header__user-name">${post.user.name}</p>
                        </div>
                        <div class="post-image-container">
                          <img class="post-image" src="${postImage}">
                        </div>
                        <div class="post-likes">
                          <button data-post-id="${post.id}" data-is-liked="${post.isLiked}" class="like-button">
                            <img src="${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
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
                          ${formattedDate}
                        </p>
                      </li>
                    `;
                    })
                    .join("")}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  // ОБРАБОТКА ЛАЙКОВ: Навешиваем клики на все кнопки-сердечки
  for (let likeBtnEl of document.querySelectorAll(".like-button")) {
    likeBtnEl.addEventListener("click", () => {
      // ПРОВЕРКА ДЛЯ НЕАВТОРИЗОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ
      // Если токена нет, сразу показываем ошибку и прерываем функцию (не отправляем fetch)
      if (!getToken()) {
        alert("Лайкать посты могут только зарегистрированные пользователи");
        return;
      }

      const postId = likeBtnEl.dataset.postId;
      const isLiked = likeBtnEl.dataset.isLiked === "true";
      const action = isLiked ? "dislike" : "like";

      fetch(
        `https://webdev-hw-api.vercel.app/api/v1/Tyryshkin2/instapro/${postId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: getToken(), // Передаем токен авторизации
          },
        },
      )
        .then((response) => {
          if (response.status === 401) {
            alert("Лайкать посты могут только зарегистрированные пользователи");
            throw new Error("Нет авторизации");
          }
          if (response.status === 404) {
            alert("Пост не найден");
            throw new Error("Пост не найден");
          }
          return response.json();
        })
        .then((responseData) => {
          // Находим измененный пост в глобальном массиве постов
          const postIndex = posts.findIndex((p) => p.id === postId);
          if (postIndex !== -1) {
            // Подменяем старый объект обновленным объектом поста, который вернул сервер
            posts[postIndex] = responseData.post;
          }
          // Мгновенно перерисовываем страницу приложения без полной перезагрузки окна
          renderApp();
        })
        .catch((error) => {
          console.error("Ошибка при обработке лайка:", error);
        });
    });
  }
}
