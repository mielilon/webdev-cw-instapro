import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl, onLikeClick }) {
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: форматируем дату создания поста относительно текущего времени.
   * Используем встроенный Intl, чтобы не подключать дополнительную библиотеку.
   */
  const formatPostDate = (date) => {
    const dateInMilliseconds = new Date(date).getTime();

    if (Number.isNaN(dateInMilliseconds)) {
      return "";
    }

    const secondsAgo = Math.round((dateInMilliseconds - Date.now()) / 1000);
    const formatter = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });
    const intervals = [
      { unit: "year", seconds: 31536000 },
      { unit: "month", seconds: 2592000 },
      { unit: "week", seconds: 604800 },
      { unit: "day", seconds: 86400 },
      { unit: "hour", seconds: 3600 },
      { unit: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      if (Math.abs(secondsAgo) >= interval.seconds) {
        return formatter.format(
          Math.round(secondsAgo / interval.seconds),
          interval.unit,
        );
      }
    }

    return formatter.format(secondsAgo, "second");
  };

  const escapeHtml = (value) => {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return characters[character];
    });
  };

  const postsHtml = posts
    .map((post) => {
      const likeImage = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      return `
        <li class="post">
          <div class="post-header" data-user-id="${escapeHtml(post.user.id)}">
            <img src="${escapeHtml(post.user.imageUrl)}" class="post-header__user-image" alt="">
            <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.description)}">
          </div>
          <div class="post-likes">
            <button data-post-id="${escapeHtml(post.id)}" class="like-button">
              <img src="${likeImage}" alt="Лайк">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${escapeHtml(post.user.name)}</span>
            ${escapeHtml(post.description)}
          </p>
          <p class="post-date">${formatPostDate(post.createdAt)}</p>
        </li>
      `;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">${postsHtml}</ul>
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

  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      const post = posts.find(
        (post) => String(post.id) === likeButton.dataset.postId,
      );

      likeButton.disabled = true;

      onLikeClick({
        postId: likeButton.dataset.postId,
        isLiked: post.isLiked,
      }).catch((error) => {
        console.error(error);
        likeButton.disabled = false;
        alert("Не удалось обновить лайк. Попробуйте ещё раз.");
      });
    });
  }
}
