import { renderHeaderComponent } from "./header-component.js";
import { posts } from "../index.js";
import { handleLikes } from "../handleLikes.js";
export function renderUserPageComponent({ appEl }) {
    const postsHtml = posts.map(
        (p) => ` <li class="post">
                        <div class="post-header" data-user-id="${p.user.id}">
                            <img src="${p.user.imageUrl}" class="post-header__user-image">
                            <p class="post-header__user-name">${p.user.name}</p>
                        </div>
                        <div class="post-image-container">
                          <img class="post-image" src="${p.imageUrl}">
                        </div>
                        <div class="post-likes">
                          <button data-liked="${p.isLiked}" data-post-id="${p.id}" class="like-button">
                            <img src="./assets/images/like${p.isLiked ? '' : '-not'}-active.svg">
                          </button>
                          <p class="post-likes-text">
                            Нравится: <strong>${p.likes.length}</strong>
                          </p>
                        </div>
                        <p class="post-text">
                          <span class="user-name">${p.user.name}</span>
                          ${p.description}
                        </p>
                        <p class="post-date">
                          ${new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </li>`
      ).join('');
      /**
       * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
       * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
       */
      const appHtml = `
                  <div class="page-container">
                    <div class="header-container"></div>
                    <ul class="posts">
                      ${postsHtml}
                    </ul>
                  </div>`;
    
  appEl.innerHTML = appHtml;
  handleLikes()
    renderHeaderComponent({
        element: document.querySelector(".header-container"),
      });
    
}