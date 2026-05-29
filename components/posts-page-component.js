import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDistanceToNow } from "./date-utils.js";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666666' font-size='20'%3E👤%3C/text%3E%3C/svg%3E";

export function renderPostsPageComponent({ appEl, posts }) {
  const token = user ? `Bearer ${user.token}` : undefined;

  const renderPosts = () => {
    const postsHtml = posts.map(post => createPostHTML(post, token)).join('');
    
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">
          ${postsHtml}
        </ul>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.querySelectorAll('.like-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        event.stopPropagation();
        const postId = button.dataset.postId;
        const isLiked = button.classList.contains('liked');
        
        if (!token) {
          alert("Войдите в систему, чтобы ставить лайки");
          return;
        }
        
        try {
          if (isLiked) {
            await dislikePost({ token, postId });
          } else {
            await likePost({ token, postId });
          }
          
          const { getPosts } = await import("../api.js");
          const newPosts = await getPosts({ token });
          window.posts = newPosts;
          renderPostsPageComponent({ appEl, posts: newPosts });
        } catch (error) {
          console.error("Ошибка при изменении лайка:", error);
          alert("Не удалось поставить лайк. Попробуйте позже.");
        }
      });
    });

    document.querySelectorAll(".post-header").forEach((header) => {
      header.addEventListener("click", () => {
        const userId = header.dataset.userId;
        if (userId) {
          goToPage(USER_POSTS_PAGE, { userId });
        }
      });
    });
  };

  renderPosts();
}

function createPostHTML(post, token) {
  const date = post.createdAt ? new Date(post.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(date);
  
  const isLiked = post.isLiked || false;
  // ИСПРАВЛЕНО: если likes - массив, берем его длину, иначе само значение
  const likeCount = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
  
  const userAvatar = post.user?.imageUrl || DEFAULT_AVATAR;
  
  const likeButtonHtml = token ? `
    <button data-post-id="${post.id}" class="like-button ${isLiked ? 'liked' : ''}" style="font-size: 24px; background: none; border: none; cursor: pointer; padding: 8px 8px 5px 0;">
      ${isLiked ? '❤️' : '🤍'}
      <span style="font-size: 14px; margin-left: 5px;">${likeCount}</span>
    </button>
  ` : `
    <div style="font-size: 24px; padding: 8px 8px 5px 0;">
      🤍 <span style="font-size: 14px;">${likeCount}</span>
    </div>
  `;

  return `
    <li class="post">
      <div class="post-header" data-user-id="${post.user?.id || ''}">
        <img src="${userAvatar}" 
             class="post-header__user-image" 
             alt="${escapeHtml(post.user?.name || 'Пользователь')}">
        <p class="post-header__user-name">${escapeHtml(post.user?.name || 'Аноним')}</p>
      </div>
      
      ${post.imageUrl ? `
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" alt="Пост" onerror="this.style.display='none'">
        </div>
      ` : ''}
      
      <div class="post-likes">
        ${likeButtonHtml}
      </div>
      
      <p class="post-text">
        <span class="user-name">${escapeHtml(post.user?.name || 'Аноним')}</span>
        ${escapeHtml(post.description || '')}
      </p>
      
      <p class="post-date">
        ${timeAgo}
      </p>
    </li>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}