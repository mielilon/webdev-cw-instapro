// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
import { getToken } from "./index.js";
import { posts } from "./index.js";
import { goToPage } from "./index.js";
import {
  AUTH_PAGE
} from "./routes.js";
const personalKey = "MethodGirl";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/prod/instapro`;

const myPostsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function initLikeHandlers({ token }) {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const postElement = event.currentTarget.closest(".post");

      const likeButtonImg = postElement.querySelector(".like-button-img");
      const likesText = postElement.querySelector(".post-likes-text");

      const userPostID = event.currentTarget.dataset.postId;

      let post = posts.find((post) => post.id === userPostID);

      let endpoints = post.isLiked ? "dislike" : "like";

      return fetch(postsHost + `/${userPostID}/${endpoints}`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("Нет авторизации");
          }

          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          const updatedPost = data.post;

          const postIndex = posts.findIndex((post) => post.id === userPostID);

          posts[postIndex] = updatedPost;

          likeButtonImg.src = updatedPost.isLiked
            ? "./assets/images/like-active.svg"
            : "./assets/images/like-not-active.svg";

          const likesAuthor =
            updatedPost.likes.length > 0 ? updatedPost.likes[0].name : "";

          const likesNumber =
            updatedPost.likes.length > 1 ? updatedPost.likes.length - 1 : "";

          likesText.innerHTML = `Нравится:
            ${
              likesAuthor
                ? `<strong>${likesAuthor}</strong>`
                : `<strong>0</strong>`
            }
            ${likesNumber ? ` и ещё <strong>${likesNumber}</strong>` : ""}
          `;

          console.log(updatedPost);
        })
        .catch((error) => {
          goToPage(AUTH_PAGE)
        });
    });
  });
}

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function createPost({ description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: getToken(),
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  }).then((response) => {
    return response.json().then((data) => {
      if (response.status === 400) {
        throw new Error(data.error);
      }

      return data;
    });
  });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
