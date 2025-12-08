import { posts } from "../index.js";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";
import { renderHeaderComponent } from "./header-component.js";
import { toggleLike } from "../helpers.js";

export function renderUserPostsPageComponent({ appEl }) {
  let userPosts = posts.posts;
  
  console.log(userPosts);
  const appHtml = 
  `
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
    ${userPosts.map((post) => (
      `<li  class="post">
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
  
    
).join('')}
    </ul> 
    </div>`
    
    appEl.innerHTML = appHtml;
     renderHeaderComponent({
        element: document.querySelector(".header-container"),
      }
    );
  toggleLike();
}
