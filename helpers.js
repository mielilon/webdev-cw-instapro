import { setLike, unsetLike } from "../api.js";
import { posts, getToken } from "../index.js";

export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
};

export function toggleLike(){
  for (let buttonLike of document.querySelectorAll(".like-button")) {
    buttonLike.addEventListener("click", async (event) => {
      if (!getUserFromLocalStorage()){
        alert('Сначала авторизуйтесь')
        return
      }
      const postId = event.target.dataset.postId;
      const post = posts.find((post) => post.id === postId);
      const postLikes = event.target.closest(".post-likes");
      const isLiked = !post.isLiked;
      const likeImageElement = postLikes.querySelector("img");
      const postLikeTextElement = postLikes.querySelector(".post-likes-text");

      likeImageElement.src = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";
      let response;
      if (post.isLiked) {
        response = await unsetLike({ token: getToken(), id: postId });
      } else {
        response = await setLike({ token: getToken(), id: postId });
      }
      post.likes = response.post.likes;
      post.isLiked = response.post.isLiked;
      postLikeTextElement.innerHTML = ` Нравится: <strong>${
        post.likes.length
            ? post.likes.length > 1
            ? `${ post.likes[Math.floor(Math.random() * post.likes.length)].name } и еще ${post.likes.length - 1}`
            : post.likes[0].name 
            : "0"
      }</strong>`;
      console.log(post.likes, post.isLiked,post);
    });
  }
}
