import { USER_POSTS_PAGE } from "../routes";
import { renderHeaderComponent } from "./header-component";
import { posts, goToPage } from "../index";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-user-id="642d00329b190443860c2f31">
                        <img src="https://www.imgonline.com.ua/examples/bee-on-daisy.jpg" class="post-header__user-image">
                        <p class="post-header__user-name">Иван Иваныч</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="https://www.imgonline.com.ua/examples/bee-on-daisy.jpg">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642d00579b190443860c2f32" class="like-button">
                        <img src="./assets/images/like-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>2</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">Иван Иваныч</span>
                      Ромашка, ромашка...
                    </p>
                    <p class="post-date">
                      19 минут назад
                    </p>
                  </li>
                  <li class="post">
                    <div class="post-header" data-user-id="6425602ce156b600f7858df2">
                        <img src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png" class="post-header__user-image">
                        <p class="post-header__user-name">Варварва Н.</p>
                    </div>

                    <div class="post-image-container">
                      <img class="post-image" src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680670675451-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-03-31%2520%25C3%2590%25C2%25B2%252012.51.20.png">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642cffed9b190443860c2f30" class="like-button">
                        <img src="./assets/images/like-not-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>35</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">Варварва Н.</span>
                      Нарисовала картину, посмотрите какая красивая
                    </p>
                    <p class="post-date">
                      3 часа назад
                    </p>
                  </li>
                  <li class="post">
                    <div class="post-header" data-user-id="6425602ce156b600f7858df2">
                        <img src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png" class="post-header__user-image">
                        <p class="post-header__user-name">Варварва Н.</p>
                    </div>

                    <div class="post-image-container">
                      <img class="post-image" src="https://leonardo.osnova.io/97a160ca-76b6-5cba-87c6-84ef29136bb3/">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642cf82e9b190443860c2f2b" class="like-button">
                        <img src="./assets/images/like-not-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>0</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">Варварва Н.</span>
                      Голова
                    </p>
                    <p class="post-date">
                      8 дней назад
                    </p>
                  </li>
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
}

// import { USER_POSTS_PAGE } from "../routes.js";
// import { renderHeaderComponent } from "./header-component.js";
// import { posts, goToPage } from "../index.js";

// export function renderPostsPageComponent({ appEl }) {
//   const posts = [
//     {
//       id: "1",
//       userId: "642d00329b190443860c2f31",
//       userName: "Иван Иваныч",
//       userImage: 'src="https://www.imgonline.com.ua/examples/bee-on-daisy.jpg"',
//       image: "https://www.imgonline.com.ua/examples/bee-on-daisy.jpg",
//       text: "Ромашка, ромашка...",
//       likes: 2,
//       createdAt: new Date(Date.now() - 19 * 60 * 1000),
//     },
//     {
//       id: "2",
//       userId: "6425602ce156b600f7858df2",
//       userName: "Варвара Н.",
//       userImage:
//         'src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-user.jpg"',
//       image:
//         "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680670675451-image.jpg",
//       text: "Нарисовала картину, посмотрите какая красивая",
//       likes: 35,
//       createdAt: new Date(Date.now() - 3 * 60 * 1000),
//     },
//     {
//       id: "3",
//       userId: "6425602ce156b600f7858df2",
//       userName: "Варвара Н.",
//       userImage:
//         'src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-user.jpg"',
//       image: "https://leonardo.osnova.io/97a160ca-76b6-5cba-87c6-84ef29136bb3/",
//       text: "Голова",
//       likes: 0,
//       createdAt: new Date(Date.now() - 8 * 60 * 1000),
//     },
//   ];

//   function formatTimeAgo(date) {
//     const now = new Date();
//     const seconds = Math.floor((now - date) / 1000);
//     if (seconds < 60) return `${seconds} секунд назад`;
//     if (minutes < 60) return `${minutes} минут назад`;
//     if (hours < 24) return `${hours} часов назад`;
//     const days = Math.floor(hours / 24);
//     return `${days} дней назад`;
//   }
// }

// const posts = "";

// let postsHtml = "";
// for (let i = 0; i < posts.length; i++) {
//   posts = posts[i];
//   const timeAgo = formatTimeAgo(posts.createdAt);

//   postsHtml += `
//       <li class="post">
//         <div class="post-header" data-user-id="${post.userId}">
//           <img src="${post.userImage}" class="post-header__user-image">
//           <p class="post-header__user-name">${post.userName}</p>
//         </div>
//         <div class="post-image-container">
//           <img class="post-image" src="${post.image}">
//         </div>
//         <div class="post-likes">
//           <button data-post-id="${post.id}" class="like-button">
//             <img src="./assets/images/like-not-active.svg">
//           </button>
//           <p class="post-likes-text">
//             Нравится: <strong>${post.likes}</strong>
//           </p>
//         </div>
//         <p class="post-text">
//           <span class="user-name">${post.userName}</span>
//           ${post.text}
//         </p>
//         <p class="post-date">
//           ${timeAgo}
//         </p>
//       </li>
//     `;
// }

// const appHtml = `
// <div class="page-container">
//   <div class="header-container"></div>
//   <ul class="posts">
//     ${postsHtml}
//   </ul>
// </div>
// `;

// appEl.innerHtml = appHtml;

// renderHeaderComponent({
//   element: document.querySelector(".header-container"),
// });

// const userHeaders = document.querySelector(".post-header");
// for (let i = 0; i < userHeaders.length; i++) {
//   userHeaders[i].addEventListeners("click", function () {
//     goToPage(USER_POSTS_PAGE, {
//       userId: this.dataset.userId,
//     });
//   });
// }
