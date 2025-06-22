import { USER_POSTS_PAGE } from "../routes.js"
import { renderHeaderComponent } from "./header-component.js"
import { posts, goToPage } from "../index.js"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

export function renderUserPostsPageComponent({ appEl }) {
    // Если постов нет
    if (posts.length === 0) {
        appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="posts-loading">У пользователя пока нет постов</div>
      </div>
    `
        renderHeaderComponent({
            element: document.querySelector(".header-container"),
        })
        return
    }

    // Получаем данные пользователя из первого поста
    const user = posts[0].user

    // Генерируем HTML для каждого поста
    const postsHtml = posts
        .map((post) => {
            return `
      <li class="post">
        <div class="post-header" data-user-id="${user.id}">
          <img src="${user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ru,
          })}
        </p>
      </li>
    `
        })
        .join("")

    // Общий HTML страницы
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="user-posts-header">
        <img src="${user.imageUrl}" class="user-posts-header__user-image">
        <h2 class="user-posts-header__user-name">${user.name}</h2>
      </div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `

    appEl.innerHTML = appHtml

    // Рендерим шапку
    renderHeaderComponent({
        element: document.querySelector(".header-container"),
    })

    // Обработчик клика по шапке пользователя
    document.querySelector(".post-header")?.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
            userId: user.id,
        })
    })
}
