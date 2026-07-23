import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, getToken, goToPage, page } from "../index.js";
import { getPosts, getUserPosts, likePost } from "../api.js";


export function renderPostsPageComponent({ appEl, posts }) {
  const appPosts = posts.map((el) => {
    let likes = ''
    
    if (el.likes.length === 1) {
      likes = `${el.likes[0].name}`
    } else if (el.likes.length >= 2) {
      likes = `${el.likes[0].name} и еще ${el.likes.length - 1}`
    } else {
      likes = `${el.likes.length}`
    }

    if (el === 0) {
      return `<h2>У пользователя пока еще нет постов</h2>`
    }

    return `<li class="post">
              <div class="post-header" data-user-id="${el.user.id}">
                  <img src="${el.user.imageUrl}" class="post-header__user-image">
                  <p class="post-header__user-name">${el.user.name}</p>
              </div>
              <div class="post-image-container">
                <img class="post-image" src="${el.imageUrl}">
              </div>
              <div class="post-likes">
                <button data-post-id="${el.id}" class="like-button ${el.isLiked ? 'like' : ''}">
                  <img src="./assets/images/${el.isLiked ? 'like-active' : 'like-not-active'}.svg">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${likes}</strong>
                </p>
              </div>
              <p class="post-text">
                <span class="user-name">${el.user.name}</span>
                ${el.description}
              </p>
              <p class="post-date">
              </p>
            </li>`;
  }).join('');

  const appEmptyPosts = `<h2 class="not-posts">У пользователя пока еще нет постов</h2>`

  const appHtml = `<div class="page-container">
                    <div class="header-container"></div>
                    <ul class="posts">
                      ${posts.length >= 1 ? appPosts : appEmptyPosts}          
                    </ul>
                  </div>`;

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

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {        
      const isLiked = likeBtn.classList.contains('like');
      const newState = isLiked ? 'dislike' : 'like';
      const userId = likeBtn.closest('.post').firstElementChild.dataset.userId;
      
      likePost({ token: getToken(), postId: likeBtn.dataset.postId, likeState: newState })
        .then(() => {
          likeBtn.classList.toggle('like');
          if (page === POSTS_PAGE) {
            return getPosts({ token: getToken() });
          } else if (page === USER_POSTS_PAGE) {
            return getUserPosts({ token: getToken(), userId: userId });
          }
        })
        .then((newPosts) => {
          posts = newPosts;
          renderPostsPageComponent({ appEl, posts });
        })
        .catch(error => {
          alert(error);
        });
    });
  }
  
}
