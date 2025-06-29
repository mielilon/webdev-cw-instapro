import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale/ru"
import { USER_POSTS_PAGE } from "../routes.js"
import { renderHeaderComponent } from "./header-component.js"
import { likePost, unlikePost } from "../api.js"
import { updatePosts } from "../index.js"

export function renderPostsPageComponent({
    appEl,
    user,
    posts,
    goToPage,
    updatePosts,
}) {
    // @TODO: реализовать рендер постов из api(Готово)
    //console.log("Актуальный список постов:", posts);

    /**
     * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"(Готово)
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${posts
            .map((post) => {
                const createdAtFormatted = formatDistanceToNow(
                    new Date(post.createdAt),
                    {
                        addSuffix: true,
                        locale: ru,
                    },
                )

                const isLiked = post.isLiked
                const likeImgSrc = isLiked
                    ? "./assets/images/like-active.svg"
                    : "./assets/images/like-not-active.svg"

                return `
              <li class="post">
                <div class="post-header" data-user-id="${post.user.id}">
                  <img
                    src="${post.user.imageUrl}"
                    class="post-header__user-image"
                    alt="${post.user.name}"
                  >
                  <p class="post-header__user-name">${post.user.name}</p>
                </div>
                <div class="post-image-container">
                  <img class="post-image" src="${post.imageUrl}" alt="Пост пользователя">
                </div>
                <div class="post-likes">
                  <button data-post-id="${post.id}" class="like-button">
                    <img src="${likeImgSrc}" alt="Like button">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.length}</strong>
                  </p>
                </div>
                <p class="post-text">
                  <span class="user-name">${post.user.name}</span> ${post.description}
                </p>
                <p class="post-date">${createdAtFormatted}</p>
              </li>
            `
            })
            .join("")}
      </ul>
    </div>
  `

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector(".header-container"),
        user,
        goToPage,
    })

    for (let userEl of document.querySelectorAll(".post-header")) {
        userEl.addEventListener("click", () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }

    for (const likeButton of document.querySelectorAll(".like-button")) {
        likeButton.addEventListener("click", () => {
            if (!user) {
                alert("Авторизуйтесь, чтобы поставить лайк")
                return
            }

            const postId = likeButton.dataset.postId
            const post = posts.find((p) => p.id === postId)
            if (!post) return

            const token = `Bearer ${user.token}`

            const apiCall = post.isLiked
                ? unlikePost({ postId, token })
                : likePost({ postId, token })

            apiCall
                .then((updatedPost) => {
                    const newPost = updatedPost.post

                    updatePosts(
                        posts.map((p) => (p.id === newPost.id ? newPost : p)),
                    )

                    renderPostsPageComponent({
                        appEl: document.getElementById("app"),
                        user,
                        posts: posts.map((p) =>
                            p.id === newPost.id ? newPost : p,
                        ),
                        goToPage,
                        updatePosts,
                    })
                })
                .catch((error) => {
                    alert(error.message)
                })
        })
    }
}
