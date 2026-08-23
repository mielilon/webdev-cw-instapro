import { posts } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { userPosts } from "../index.js";
import { formatDistanceToNow } from "https://esm.sh/date-fns@2.29.3";
import { ru } from "https://esm.sh/date-fns@2.29.3/locale";

export function renderAccountPage() {
  console.log(userPosts);

  userPosts.forEach((userPost) => {
    const createdAt = new Date(userPost.createdAt);

    const formattedDate = formatDistanceToNow(createdAt, {
      addSuffix: true,
      locale: ru,
    });

    const likesAuthor = userPost.likes.length > 0 ? userPost.likes[0].name : "";

    const likesNumber =
    /**
     * REVIEW:
     * лучше использовать template literals, более читабельно выглядит.
     */
      userPost.likes.length > 1 ? " ещё " + (userPost.likes.length - 1) : "";

    let userHeader = document.querySelector(".posts-user-header");

    userHeader.innerHTML = `
        <img src="${userPost.user?.imageUrl}" class="posts-user-header__user-image">
        <p class="posts-user-header__user-name">${userPost.user?.name}</p>
      `;

    let post = document.createElement("li");
    post.classList.add("post", "user-post");

    /**
     * REVIEW:
     * post - это DOM-элемент, который ты только что создала,
     * на нем по умолчанию нет свойства isLiked, оно здесь всегда undefined.
     * Полагаю ты имела ввиду userPost.
     */
    const isLiked = post.isLiked;
    const likeIconSrc = isLiked
      ? "./assets/images/like-active.svg"
      : "./assets/images/like-not-active.svg";

    post.innerHTML = `
      <div class="user-post-image-container"  style="background-image: url('${userPost.imageUrl}')";>
        <img src="${userPost.imageUrl}" class ="user-post-image ">
      </div>
      <div class="post-likes">
       <button class="like-button" data-post-id = ${userPost.id}>
       <img src="${likeIconSrc}" class="like-button-img">
       </button>
       <p class="post-likes-text"> Нравится:
          ${likesAuthor ? `<strong>${likesAuthor}</strong>` : `<strong>0</strong>`}
          ${likesNumber ? ` и <strong>${likesNumber}</strong>` : ""}</p>
      </div>
      <p class="post-date user-post-date">${formattedDate}</p>  
      <p class="post-text">
          <span class="user-name">${userPost?.user.name}: </span>
          <span class="post-description">${userPost?.description}</span>
      </p>        
    `;

    let posts = document.querySelector(".posts");

    posts.append(post);
  });
}
