import { posts } from "../index.js";
import { renderPostsPageComponent } from "./posts-page-component.js";

export const putLike = (postId) => {
  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const postId = likeButton.dataset.postId;
      const post = posts[index];

      if (!post.isLiked) {
        post.likes++;
        post.isLiked = true;
      } else {
        post.likes--;
        post.isLiked = false;
      }

      renderPostsPageComponent();
      /*})
      .catch((error) => {
        console.error("Ошибка при постановке лайка:", error);*/
    });
  }
};
