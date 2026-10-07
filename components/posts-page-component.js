import { USER_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts
    .map((post) => {
      const likeImage = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      const safeName = escapeHtml(post.user.name);
      const safeDescription = escapeHtml(post.description);

      return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${safeName}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="${likeImage}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${safeName}</span>
            ${safeDescription}
          </p>
          <p class="post-date">
            ${post.createdAt}
          </p>
        </li>
      `;
    })
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

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  // Лайки — без перезагрузки всей ленты
  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      if (!user) {
        goToPage(AUTH_PAGE);
        return;
      }

      const postId = likeButton.dataset.postId;
      const token = `Bearer ${user.token}`;
      const post = posts.find((p) => p.id === postId);

      likeButton.disabled = true;

      const likeRequest = post.isLiked
        ? dislikePost({ postId, token })
        : likePost({ postId, token });

      likeRequest
        .then((updatedPost) => {
          post.likes = updatedPost.likes;
          post.isLiked = updatedPost.isLiked;
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          likeButton.disabled = false;
        });
    });
  }

  // Лайтбокс: клик по фото открывает его на весь экран
  for (let postImage of document.querySelectorAll(".post-image")) {
    postImage.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.classList.add("lightbox-overlay");
      overlay.innerHTML = `<img class="lightbox-image" src="${postImage.src}">`;
      overlay.addEventListener("click", () => {
        overlay.remove();
      });
      document.body.appendChild(overlay);
    });
  }
}
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${safeName}</span>
            ${safeDescription}
          </p>
          <p class="post-date">
            ${post.createdAt}
          </p>
        </li>
      `;
    })
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

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  // Лайки — без перезагрузки всей ленты
  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      if (!user) {
        goToPage(AUTH_PAGE);
        return;
      }

      const postId = likeButton.dataset.postId;
      const token = `Bearer ${user.token}`;
      const post = posts.find((p) => p.id === postId);

      likeButton.disabled = true;

      const likeRequest = post.isLiked
        ? dislikePost({ postId, token })
        : likePost({ postId, token });

      likeRequest
        .then((updatedPost) => {
          post.likes = updatedPost.likes;
          post.isLiked = updatedPost.isLiked;
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          likeButton.disabled = false;
        });
    });
  }

  // Лайтбокс: клик по фото открывает его на весь экран
  for (let postImage of document.querySelectorAll(".post-image")) {
    postImage.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.classList.add("lightbox-overlay");
      overlay.innerHTML = `<img class="lightbox-image" src="${postImage.src}">`;
      overlay.addEventListener("click", () => {
        overlay.remove();
      });
      document.body.appendChild(overlay);
    });
  }
}
