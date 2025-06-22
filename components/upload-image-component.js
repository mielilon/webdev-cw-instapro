export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    let imageUrl = ""

    const render = () => {
        const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h2>Добавить пост</h2>
        <div class="form-inputs">
          <textarea 
            id="post-description" 
            class="textarea" 
            placeholder="Описание поста..." 
            rows="4"
          ></textarea>
          
          <div class="upload-image-container"></div>
        </div>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
    `

        appEl.innerHTML = appHtml

        const uploadImageContainer = appEl.querySelector(
            ".upload-image-container",
        )
        // eslint-disable-next-line no-undef
        renderUploadImageComponent({
            element: uploadImageContainer,
            onImageUrlChange(newImageUrl) {
                imageUrl = newImageUrl
            },
        })

        document.getElementById("add-button").addEventListener("click", () => {
            const description = document
                .getElementById("post-description")
                .value.trim()

            if (!imageUrl) {
                alert("Пожалуйста, загрузите изображение")
                return
            }

            if (!description) {
                alert("Пожалуйста, введите описание поста")
                return
            }

            onAddPostClick({
                description: description,
                imageUrl: imageUrl,
            })
        })
    }

    render()
}
