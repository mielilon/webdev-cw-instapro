import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost, deletePost } from "../api.js";

export function renderUserPostsPageComponent({ appEl, userId }) {
  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "только что";
    if (diffInMinutes < 60) return `${diffInMinutes} минут назад`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} часов назад`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дней назад`;

    return date.toLocaleDateString("ru-RU");
  };

  // Генерируем HTML для постов
  const postsHtml = posts
    .map(
      (post) => `
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
          <img src="./assets/images/${
            post.isLiked ? "like-active" : "like-not-active"
          }.svg">
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
        ${formatDate(post.createdAt)}
      </p>
      ${
        user && user.id === post.user.id
          ? `
        <button class="delete-button" data-post-id="${post.id}">Удалить</button>
      `
          : ""
      }
    </li>
  `
    )
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчики для клика по пользователю
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  // Обработчики для лайков
  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      const postId = likeButton.dataset.postId;
      const post = posts.find((p) => p.id === postId);

      if (!user) {
        alert("Для лайка нужно авторизоваться");
        return;
      }

      if (post.isLiked) {
        // Убираем лайк
        dislikePost({ postId, token: `Bearer ${user.token}` })
          .then((response) => {
            // Обновляем пост в списке
            const index = posts.findIndex((p) => p.id === postId);
            if (index !== -1) {
              posts[index] = response.post;
              renderUserPostsPageComponent({ appEl, userId });
            }
          })
          .catch((error) => {
            console.error(error);
            alert(error.message);
          });
      } else {
        // Ставим лайк
        likePost({ postId, token: `Bearer ${user.token}` })
          .then((response) => {
            // Обновляем пост в списке
            const index = posts.findIndex((p) => p.id === postId);
            if (index !== -1) {
              posts[index] = response.post;
              renderUserPostsPageComponent({ appEl, userId });
            }
          })
          .catch((error) => {
            console.error(error);
            alert(error.message);
          });
      }
    });
  }

  // Обработчики для удаления постов
  for (let deleteButton of document.querySelectorAll(".delete-button")) {
    deleteButton.addEventListener("click", () => {
      const postId = deleteButton.dataset.postId;

      if (confirm("Вы уверены, что хотите удалить этот пост?")) {
        deletePost({ postId, token: `Bearer ${user.token}` })
          .then(() => {
            // Удаляем пост из списка
            const index = posts.findIndex((p) => p.id === postId);
            if (index !== -1) {
              posts.splice(index, 1);
              renderUserPostsPageComponent({ appEl, userId });
            }
          })
          .catch((error) => {
            console.error(error);
            alert(error.message);
          });
      }
    });
  }
}
