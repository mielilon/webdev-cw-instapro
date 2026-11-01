import { addPost, getPosts, getUserPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const onBackToPostsClick = () => {
  goToPage(POSTS_PAGE);
};

let attempts = 0;

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
          attempts = 0;
        })
        .catch((error) => {
          console.error(error);
          attempts++;
          if (attempts < 3) {
            goToPage(POSTS_PAGE);
          } else {
            attempts = 0;

            const appEl = document.getElementById("app");

            appEl.innerHTML = `
              <div class="page-container">
                <h2>Не удалось загрузить посты</h2>
                <p>Проверьте подключение к интернету.</p>
                <button id="retry-button">Повторить загрузку</button>
              </div>
            `;
            document
              .querySelector("#retry-button")
              .addEventListener("click", () => {
                goToPage(POSTS_PAGE);
              });
          }
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // @@TODO: реализовать получение постов юзера из API
      page = LOADING_PAGE;
      renderApp();

      return getUserPosts({ token: getToken(), id: data.userId }).then(
        (newPosts) => {
          console.log("Открываю страницу пользователя: ", data.userId);
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        },
      );
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        addPost({ token: getToken(), description, imageUrl })
          .then((data) => {
            if (data.result === "ok") {
              console.log("Добавляю пост...", { description, imageUrl });
              goToPage(POSTS_PAGE);
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // @TODO: реализовать страницу с фотографиями отдельного пользвателя

    return renderPostsPageComponent({ appEl });
  }
};

goToPage(POSTS_PAGE);
