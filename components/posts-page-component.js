import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import * as state from "../index.js";
import { toggleLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  const postsHtml = state.posts.length
    ? state.posts
        .map((post) => {
          const formattedDate = post.createdAt
            ? new Date(post.createdAt).toLocaleString()
            : "";
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
                <img src="./assets/images/${
                  post.isLiked ? "like-active" : "like-not-active"
                }.svg" class="like-icon">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${
                  Array.isArray(post.likes) ? post.likes.length : post.likes
                }</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">${formattedDate}</p>
          </li>
          `;
        })
        .join("")
    : "<p>Нет постов</p>";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      toggleLike({
        postId,
        token: state.getToken(),
        isLiked: post.isLiked,
      })
        .then((updatedPost) => {
          const updatedPosts = state.posts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                isLiked: updatedPost.post.isLiked,
                likes: updatedPost.post.likes.length,
              };
            }
            return p;
          });
          state.posts.splice(0, state.posts.length, ...updatedPosts);
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error("Ошибка при обновлении лайка:", error);
          alert("Не удалось обновить лайк");
        });
    });
  });
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      state.goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}
