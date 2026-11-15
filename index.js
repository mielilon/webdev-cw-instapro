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

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

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
      page = LOADING_PAGE;
      renderApp();

      return fetch(
        `https://wedev-api.sky.pro/api/v1/prod/instapro/user-posts/${data.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: getToken(),
          },
        },
      )
        .then((response) => {
          if (response.status === 401) {
            throw new Error("Нет авторизации");
          }

          return response.json();
        })
        .then((data) => {
          page = USER_POSTS_PAGE;
          posts = data.posts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          page = USER_POSTS_PAGE;
          posts = [];
          renderApp();
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

  const onLikeClick = ({ postId, isLiked }) => {
    const action = isLiked ? "dislike" : "like";

    return fetch(
      `https://wedev-api.sky.pro/api/v1/prod/instapro/${postId}/${action}`,
      {
        method: "POST",
        headers: {
          Authorization: getToken(),
        },
      },
    )
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Нет авторизации");
        }

        if (!response.ok) {
          throw new Error("Не удалось обновить лайк");
        }

        return response.json();
      })
      .then((data) => {
        posts = posts.map((post) =>
          String(post.id) === String(postId) ? data.post : post,
        );
        renderApp();
      });
  };
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
        // @TODO: реализовать добавление поста в API
        return fetch("https://wedev-api.sky.pro/api/v1/prod/instapro", {
          method: "POST",
          headers: {
            Authorization: getToken(),
          },
          body: JSON.stringify({ description, imageUrl }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Не удалось добавить публикацию");
            }

            return response.json();
          })
          .then(() => {
            goToPage(POSTS_PAGE);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      onLikeClick,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // @TODO: реализовать страницу с фотографиями отдельного пользвателя
    return renderPostsPageComponent({
      appEl,
      onLikeClick,
    });
  }
};

goToPage(POSTS_PAGE);
