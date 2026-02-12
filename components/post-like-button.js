import { addLike, disLike } from "../api.js";
import { getToken } from "../index.js";

export function renderLikeButton({ element, post, id, length, isLiked }) {
  const buttonHtml = `
                        <button data-post-id="${id}" class="like-button">
                        <img src="${
                          isLiked
                            ? "./assets/images/like-active.svg"
                            : "./assets/images/like-not-active.svg"
                        }">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${length}</strong>
                      </p>
`;
  element.innerHTML = buttonHtml;
  const button = post.querySelector(".like-button");
  let img = button.querySelector("img");
  const count = post.querySelector(".post-likes-text strong");

  button.addEventListener("click", () => {
    const id = button.dataset.postId;

    if (!isLiked) {
      addLike({ token: getToken(), id }).then(() => {
        img.src = "./assets/images/like-active.svg";
        count.innerText = +count.innerText + 1;
      });
    } else {
      if (count.innerText > 0) {
        disLike({ token: getToken(), id }).then(() => {
          img.src = "./assets/images/like-not-active.svg";
          count.innerText = +count.innerText - 1;
        });
      }
    }
    isLiked = !isLiked;
  });
}
