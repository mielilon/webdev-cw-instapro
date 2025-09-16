import { getPosts, addPost, getUserPosts } from "./api.js";
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
import { renderUserPostsPageComponent } from "./components/user-posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
export let pageData = null;

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

// Проверяем авторизацию при загрузке приложения
const checkAuth = () => {
  if (user && user.token) {
    // Если есть токен, проверяем его валидность, делая запрос к API
    return getPosts({ token: getToken() })
      .then(() => {
        // Если запрос прошел успешно, пользователь авторизован
        return true;
      })
      .catch(() => {
        // Если запрос не прошел, удаляем пользователя из localStorage
        user = null;
        removeUserFromLocalStorage();
        return false;
      });
  }
  return Promise.resolve(false);
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  pageData = data;
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
        })
        .catch((error) => {
          console.error(error);
          if (error.message === "Нет авторизации") {
            // Если нет авторизации, переходим на страницу авторизации
            goToPage(AUTH_PAGE);
          } else {
            // Если другая ошибка, показываем пустую страницу постов
            page = POSTS_PAGE;
            posts = [];
            renderApp();
          }
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getUserPosts({ userId: data.userId, token: getToken() })
        .then((userPosts) => {
          page = USER_POSTS_PAGE;
          posts = userPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          if (error.message === "Нет авторизации") {
            // Если нет авторизации, переходим на страницу авторизации
            goToPage(AUTH_PAGE);
          } else {
            // Если другая ошибка, показываем пустую страницу постов
            page = USER_POSTS_PAGE;
            posts = [];
            renderApp();
          }
        });
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
        console.log("Данные для отправки:", {
          description,
          imageUrl,
          token: getToken(),
        });
        addPost({ description, imageUrl, token: getToken() })
          .then((response) => {
            console.log("Успешный ответ API:", response);
            // После успешного добавления поста перезагружаем список постов
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error(error);
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
    return renderUserPostsPageComponent({
      appEl,
      userId: pageData?.userId,
    });
  }
};

// Инициализация приложения с проверкой авторизации
checkAuth().then((isAuthenticated) => {
  if (isAuthenticated) {
    goToPage(POSTS_PAGE);
  } else {
    goToPage(AUTH_PAGE);
  }
});
