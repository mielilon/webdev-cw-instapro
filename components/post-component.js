import { getToken, goToPage } from "../index.js";
import { deletePost } from "../api.js";
import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderLikeButton } from "./post-like-button.js";
import { formatDistanceToNow } from "../node_modules/date-fns/index.js";
import { ru } from "../node_modules/date-fns/locale/ru.js";

function escapeHtml(str) {
  if (!str) return str;
  return str.replace(
    /[&<>'"]/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&apos;",
        '"': "&quot;",
      })[match],
  );
}

export function renderAllPosts({ posts, element }) {
  const userAuthJson = localStorage.getItem("user");
  const userAuth = userAuthJson && JSON.parse(userAuthJson);

  posts.forEach((post) => {
    const buttonHtml =
      userAuth?._id == post.user.id
        ? `
      <button data-post-id="${post.id}" class="delete-button">
        Удалить
      </button>
    `
        : "";
    const postHtml = `
      <li class="post">
        <div class="post-header" data-user-id=${post.user.id}>
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes"></div>
        <p class="post-text">
          <span class="user-name">${escapeHtml(post.user.name)}</span>
          ${escapeHtml(post.description)}
        </p>
        <p class="post-date">
            ${timing(new Date(post.createdAt))}
        </p>
        <div class="post-button-delete">
          ${buttonHtml}
        </div>
     </li>
      `;

    element.innerHTML += postHtml;
  });
  buttonsDeletePost();
  buttonsLikePost({ posts });
  buttonUserPosts();
  likePosts({ posts });
}

function timing(date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
}

function likePosts({ posts }) {
  const postsAll = document.querySelectorAll(".post");

  postsAll.forEach((post, index) => {
    renderLikeButton({
      element: post.querySelector(".post-likes"),
      post,
      id: posts[index].id,
      length: posts[index].likes.length,
      isLiked: posts[index].isLiked,
    });
  });
}

function buttonsLikePost({ posts }) {
  const postsAll = document.querySelectorAll(".post");

  postsAll.forEach((post, index) => {
    renderLikeButton({
      element: post.querySelector(".post-likes"),
      post,
      id: posts[index].id,
      length: posts[index].likes.length,
      isLiked: posts[index].isLiked,
    });
  });
}

function buttonUserPosts() {
  const postsHeaders = document.querySelectorAll(".post-header");
  postsHeaders.forEach((postHeader) => {
    postHeader.addEventListener("click", () => {
      const id = postHeader.dataset.userId;
      goToPage(USER_POSTS_PAGE, id);
    });
  });
}

function buttonsDeletePost() {
  const posts = document.querySelectorAll(".post");
  posts.forEach((post) => {
    const button = post.querySelector(".delete-button");
    if (button) {
      button.addEventListener("click", () => {
        const id = button.dataset.postId;
        deletePost({ token: getToken(), id })
          .then(() => {
            post.remove();
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error("Ошибка удаления поста:", error);
          });
      });
    }
  });
}
