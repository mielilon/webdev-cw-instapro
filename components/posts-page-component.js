import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { addLike, dislike } from "../api.js";
import { escapeHtml } from "../escapeHtml.js";
import { formatDistanceToNow } from "https://esm.sh/date-fns@2.29.3";
import { ru } from "https://esm.sh/date-fns@2.29.3/locale";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api

  console.log("Актуальный список постов:", posts);

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                ${posts
                  .map((post) => {
                    return `<li class="post">
                    <div class="post-header" data-user-id=${post.user.id}>
                        <img src="${post.user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id=${post.id} class="like-button">
                        <img src="${post.isLiked ? "./assets/images/like-active.svg" : "./assets/images/like-not-active.svg"}">
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
                      ${formatDistanceToNow(new Date(post.createdAt), {
                        locale: ru,
                        addSuffix: true,
                      })}
                    </p>
                  </li>`;
                  })
                  .join("")}</ul></div>`;

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

  const likeButtonsEl = document.querySelectorAll(".like-button");

  likeButtonsEl.forEach((likeButtonEl) => {
    likeButtonEl.addEventListener("click", () => {
      if (getToken()) {
        const postLikesEl = likeButtonEl.closest(".post-likes");

        const id = likeButtonEl.dataset.postId;
        const img = likeButtonEl.querySelector("img");

        const countLikes = postLikesEl.querySelector("strong");

        const currentPost = posts.find((post) => {
          return post.id === id;
        });

        if (currentPost.isLiked) {
          dislike({ token: getToken(), id: id })
            .then((post) => {
              img.src = "./assets/images/like-not-active.svg";
              countLikes.textContent = post.likes.length;
              currentPost.isLiked = post.isLiked;
            })
            .catch((error) => {
              console.log(error.message);
            });
        } else {
          addLike({
            token: getToken(),
            id: id,
          })
            .then((post) => {
              img.src = "./assets/images/like-active.svg";
              countLikes.textContent = post.likes.length;
              currentPost.isLiked = post.isLiked;
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      } else {
        alert("Чтобы поставить лайк, необходимо авторизоваться");
      }
    });
  });
}
/* console.log(likeButtonEl); */
