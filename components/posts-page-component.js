import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage } from '../index.js'
import { getAllPosts } from '../api.js'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
    const appHtml = `
        <div class="page-container">
            <div class="header-container"></div>
            <ul class="posts"></ul>
        </div>
    `

    appEl.innerHTML = appHtml

    const renderPostsFromApi = () => {
        const containerPosts = document.querySelector('.posts')
        posts.forEach((post) => {
            const listEl = document.createElement('li')
            listEl.classList.add('post')
            const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })

            listEl.innerHTML = `
                <div class="post-header" data-user-id="${post.user.id}">
                    <img src="${post.user.imageUrl}" class="post-header__user-image">
                    <p class="post-header__user-name">${post.user.name}</p>
                </div>
                <div class="post-image-container">
                    <img class="post-image" src="${post.imageUrl}">
                </div>
                <div class="post-likes">
                    <button data-post-id="${post.id}" class="like-button">
                        <img src="./assets/images/like-active.svg">
                    </button>
                    <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length}</strong>
                    </p>
                </div>
                <p class="post-text">
                    <span class="user-name">${post.user.name}</span>
                    ${post.description}
                </p>
                <p class="post-date">${formattedDate}</p>
            `
            containerPosts.appendChild(listEl)
        })
    }

    renderPostsFromApi()

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    document.querySelectorAll('.post-header').forEach((userEl) => {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    })
}

// export function renderPostsPageComponent({ appEl }) {
//     // export function renderPostsPageComponent(posts) {
//     // getAllPosts()
//     // @TODO: реализовать рендер постов из api
//     // console.log(appEl)
//     // console.log('Актуальный список постов:', posts)
//     const appHtml = `
//                 <div class="page-container">
//                   <div class="header-container"></div>
//                 </div>
//                  `    // document.body.innerHTML = appHtmlm

//     // const containerPage = document.querySelector('.page-container')
//     // console.log(containerPage)
//     const renderPostsFromApi = () => {
//         const containerPosts = document.createElement('ul')
//         containerPosts.classList.add('posts')
// console.log(typeof appHtml);
//         // appHtml.appendChild(containerPosts)
//         console.log(document.querySelector('.posts'))

//         console.log(posts)
//         posts.map((post) => {
//             console.log(post.user.name)
//             const listEl = document.createElement('li')
//             listEl.classList.add('post')

//             listEl.innerHTML = `
//                     <div class="post-header" data-user-id="${post.user.id}">
//                         <img src="${post.user.imageUrl}" class="post-header__user-image">
//                         <p class="post-header__user-name">${post.user.name}</p>
//                     </div>
//                     <div class="post-image-container">
//                       <img class="post-image" src="${post.imageUrl}">
//                     </div>
//                     <div class="post-likes">
//                       <button data-post-id="${post.id}" class="like-button">
//                         <img src="./assets/images/like-active.svg">
//                       </button>
//                       <p class="post-likes-text">
//                         Нравится: <strong>2</strong>
//                       </p>
//                     </div>
//                     <p class="post-text">
//                       <span class="user-name">${post.user.name}</span>
//                       ${post.description}
//                     </p>
//                     <p class="post-date">
//                       ${post.createdAt}
//                     </p>
//                   `
//             containerPosts.appendChild(listEl)
//         })

//         // return
//     }

//     renderPostsFromApi()
//     // appEl.innerHTML = renderPostsFromApi()
//     // console.log(appEl)
//     // console.log(renderHeaderComponent());

//     // return newPost

//     // containerPage = document.createElement('div')
//     // const headerPosts
//     // headerPosts.classList.add('.header-container')

//     // appEl.innerHTML = `
//     //             <ul class="posts"></ul>`
//     //             console.log(headerPosts);

//     // const postEl = document.querySelector('.posts')
//     // console.log(newPost)
//     // console.log(newPost)
//     // console.log(document.querySelector('.posts'));
//     //         const appHtml = `
//     // <div class="page-container">
//     //                 <div class="header-container"></div>

//     //                 <ul class="posts">

//     //                   </ul>
//     //             </div>
//     //              `
//     // appEl.innerHTML = appHtml
//     // console.log(appEl)

//     // const posts = appEl.post
//     // posts.forEach((post) => {
//     //     const newPost = {
//     //         id: post.id,
//     //         imageUrl: post.imageUrl,
//     //         createdAt: post.date,
//     //         description: post.description,
//     //         user: {
//     //             id: post.user.id,
//     //             name: post.user.name,
//     //             login: post.user.login,
//     //             imageUrl: post.user.imageUrl,
//     //         },
//     //         likes: post.likes.map((like) => ({ id: like.id, name: like.name })),
//     //         isLiked: post.isLiked,
//     // }
//     // console.log(newPost)

//     // console.log(`выводим каждый пост ${newPost.id}`);

//     /**
//      * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
//      * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
//      */

//     appEl.innerHTML = appHtml

//     renderHeaderComponent({
//         element: document.querySelector('.header-container'),
//     })

//     for (let userEl of document.querySelectorAll('.post-header')) {
//         userEl.addEventListener('click', () => {
//             goToPage(USER_POSTS_PAGE, {
//                 userId: userEl.dataset.userId,
//             })
//         })
//     }
// }
