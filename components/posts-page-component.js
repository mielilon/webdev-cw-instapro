import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";

import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";
import { toggleLike } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                ${posts
                  .map(
                    (post) =>
                      `<li d class="post">
                    <div class="post-header" data-user-id=${post.user.id}>
                        <img src='${
                          post.user.imageUrl
                        }' class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src='${post.imageUrl}'>
                    </div>
                    <div class="post-likes">
                      <button data-post-id=${post.id} class="like-button">
                        <img data-post-id=${post.id} src="${
                        post.isLiked
                          ? "./assets/images/like-active.svg"
                          : "./assets/images/like-not-active.svg"
                      }">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${
                          post.likes.length
                            ? post.likes.length > 1
                              ? `${
                                  post.likes[
                                    Math.floor(
                                      Math.random() * post.likes.length
                                    )
                                  ].name
                                } и еще ${post.likes.length - 1}`
                              : post.likes[0].name
                            : "0"
                        }</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${formatDistanceToNow(post.createdAt, {
                        locale: ru,
                      })} назад
                    </p>
                  </li>`
                  )
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
  toggleLike()
}
  
