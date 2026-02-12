import { renderHeaderComponent } from "./header-component.js";
import { renderAllPosts } from "./post-component.js";

export async function renderPostsUserPageComponent({ appEl, posts }) {
  const postHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                  <ul class="posts">
                  </ul>
              </div>
              `;

  appEl.innerHTML = postHtml;
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  renderAllPosts({
    posts,
    element: document.querySelector(".posts"),
  });
}
