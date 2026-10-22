import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderPostsPageComponent({ appEl, onLikeClick }) {
  console.log("Актуальный список постов:", posts);

  if (!posts || posts.length === 0) {
    appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <p class="empty-posts">Пока нет постов</p>
      </div>`;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    return;
  }

  const postsHtml = posts.map((post) => {
    const likeIcon = post.isLiked
      ? "./assets/images/like-active.svg"
      : "./assets/images/like-not-active.svg";

    const dateText = dateFns.formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: dateFns.locale.ru,
    });

    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" onerror="this.style.display='none'; this.onerror=null;">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${likeIcon}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${escapeHtml(post.user.name)}</span>
          ${escapeHtml(post.description)}
        </p>
        <p class="post-date">
          ${dateText}
        </p>
      </li>
    `;
  }).join('');

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

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let button of document.querySelectorAll(".like-button")) {
    button.addEventListener("click", () => {
      onLikeClick({ postId: button.dataset.postId });
    });
  }
}