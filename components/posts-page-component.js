import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, user } from "../index.js";
import { renderUserPostsPageComponent } from "./user-posts-page-component.js";
import { fetchLikePosts } from "../api.js";
import { formatDate } from "./formatDate.js";

export function renderPostsPageComponent() {
  // @TODO: реализовать рендер постов из api
  const appEl = document.getElementById("app");

  const postsHtml = posts
    .map((post) => {
      return `<li class="post">
                    <div class="post-header" data-user-id="${post.userId
                      .replaceAll("<", "&lt;")
                      .replaceAll(">", "&gt;")}">
                        <img src="${post.userImg}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.userName
                          .replaceAll("<", "&lt;")
                          .replaceAll(">", "&gt;")}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button class="like-button" data-post-id="${post.id}">
                        <img src="${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
                        
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.userName
                        .replaceAll("<", "&lt;")
                        .replaceAll(">", "&gt;")}</span>
                      ${post.description
                        .replaceAll("<", "&lt;")
                        .replaceAll(">", "&gt;")}
                    </p>
                    <p class="post-date">
                      ${formatDate(post.createdAt)}
                    </p>
                  </li>`;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      const userId = userEl.dataset.userId;
      renderUserPostsPageComponent(userId);
    });
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      const postId = likeEl.dataset.postId;
      const post = posts.find((post) => post.id === postId);

      if (!post) {
        console.error("Пост не найден");
        return;
      }

      if (!user || !user._id) {
        alert("Пожалуйста, авторизуйтесь");
        return;
      }

      fetchLikePosts(postId, post.isLiked)
        .then(() => {
          renderPostsPageComponent();
        })
        .catch((error) => {
          console.error("Ошибка при обработке лайка:", error);
        });
    });
  }
}
