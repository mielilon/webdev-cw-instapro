import { renderHeaderComponent } from "./header-component.js"
import { renderUploadImageComponent } from "./upload-image-component.js"

export function renderAddPostPageComponent({ appEl, user, onAddPostClick }) {
    let imageUrl = ""

    const render = () => {
        // @TODO: Реализовать страницу добавления поста(Готово)
        appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <h2>Добавить пост</h2>
        <div class="upload-image-container"></div>
        <input
          type="text"
          id="description-input"
          placeholder="Добавьте описание"
          class="description-input"
        />
        <button class="button" id="add-button">Добавить</button>
      </div>
    `

        renderHeaderComponent({
            element: document.querySelector(".header-container"),
            user,
        })

        renderUploadImageComponent({
            element: document.querySelector(".upload-image-container"),
            onImageUrlChange: (newImageUrl) => {
                imageUrl = newImageUrl
            },
        })

        document.getElementById("add-button").addEventListener("click", () => {
            const description = document
                .getElementById("description-input")
                .value.trim()

            if (!description || !imageUrl) {
                alert("Добавьте описание и выберите картинку")
                return
            }

            onAddPostClick({ description, imageUrl })
        })
    }

    render()
}
