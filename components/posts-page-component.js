import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);
  
  // Генерируем HTML для каждого поста
  const postsHtml = posts.map((post) => {
    // Определяем количество лайков
    const likesCount = post.likes ? post.likes.length : 0;
    
    // Определяем, лайкнул ли текущий пользователь этот пост
    const isLiked = user && post.likes ? 
      post.likes.some(like => like.userId === user._id) : false;
    
    // Форматируем дату (пока просто выводим, потом добавим date-fns)
    const postDate = post.createdAt; // Позже заменим на форматирование
    
    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${likesCount}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${postDate}
        </p>
      </li>
    `;
  }).join('');
  
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml ? postsHtml : '<p>Постов пока нет</p>'}
      </ul>
    </div>
  `;

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
}
