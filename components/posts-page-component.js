import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { formatDistanceToNow } from "https://esm.sh/date-fns@2.29.3";
import { ru } from "https://esm.sh/date-fns@2.29.3/locale";
import { initLikeHandlers } from "../api.js";
import { getToken } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  /**СДЕЛАНО*/

  const postsList = document.createElement("ul");
  postsList.classList.add("posts");

  /**
     * REVIEW:
     * map().join() - норм решение, но можно уместить в один reduce().
     */ 
  const appHtml = posts
    .map((post, index) => {
      const createdAt = new Date(post.createdAt);

      const formattedDate = formatDistanceToNow(createdAt, {
        addSuffix: true,
        locale: ru,
      });

      const likesAuthor = post.likes.length > 0 ? post.likes[0].name : "";

      const likesNumber =
        post.likes.length > 1 ? " ещё " + (post.likes.length - 1) : "";

      const isLiked = post.isLiked;
      const likeIconSrc = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      return `
                  <li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${post.user?.imageUrl}" class="post-header__user-image">
                        <div class post-user>
                          <p class="post-user__user-name">${post.user?.name}</p>
                          <p class="post-user__post-date">${formattedDate}</p>
                        </div>
                    </div>
                    <div class="post-image-container" style="background-image: url('${post.imageUrl}');">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}"  class="like-button">
                        <img src="${likeIconSrc}" class="like-button-img">
                      </button>
                      <p class="post-likes-text">
                        Нравится:  
                          ${likesAuthor ? `<strong>${likesAuthor}</strong>` : `<strong>0</strong>`}
                          ${likesNumber ? ` и <strong>${likesNumber}</strong>` : ""}
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post?.user.name}: </span>
                      <span class="post-description">${post?.description}</span>
                    </p>
                  </li> `;
    })
    .join("");

  postsList.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  /**
   * REVIEW:
   * уже ранее (на 73 строке) ты выполняла поиск document.querySelector(".header-container"),
   * поэтому тут можно использовать уже найденный элемент, вынесенный в отдельную переменную.
   */
  let headerContainer = document.querySelector(".header-container");

  headerContainer.after(postsList);
  initLikeHandlers({ token: getToken() });
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest(".post-description");

  if (target) {
    target.classList.toggle("is-open");
  }
});
