import { getPosts } from "./api.js";
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
import { renderHeaderComponent } from "./components/header-component.js";
import { renderAccountPage } from "./components/render-account-page.js";
import { uploadImage, createPost, initLikeHandlers } from "./api.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
export let userPosts = [];

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
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
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // @@TODO: реализовать получение постов юзера из API

      // СДЕЛАНО
      let userId = data.userId;
      page = USER_POSTS_PAGE;
      userPosts = posts.filter((post) => post.user.id === userId);

      return renderApp();
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
      async onAddPostClick({ description, imageUrl }) {
        // @TODO: реализовать добавление поста в API

        //СДЕЛАНО
        if (description.trim() === "") {
              alert("В описании пусто :(, напишите что-нибудь");
              return
          }

        try {
          await createPost({ description, imageUrl });

          console.log("Добавляю пост...", { description, imageUrl });
          goToPage(POSTS_PAGE);
        } catch (error) {
          console.log(error.message);
          if (error.message === "В теле не передан description") {
            alert("Добавьте описание");
          }

          if (error.message === "В теле не передан imageUrl") {
            alert("Вы забыли добавить картинку");
          }
        }
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // СДЕЛАНО

    appEl.innerHTML = `
    <div class = "page-container">
    <div class = "header-container"></div>
    <div class = "posts-user-header"></div>
    <ul class ="posts user-posts"></ul>
    </div>`;

    let headerContainer = document.querySelector(".header-container");

    renderHeaderComponent({ element: headerContainer });
    renderAccountPage();
 initLikeHandlers({ token: getToken() })
 
    return;
  }
};

goToPage(POSTS_PAGE);
