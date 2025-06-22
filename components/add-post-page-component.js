export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    const render = () => {
        const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h2>Добавить пост</h2>
        <div class="form-inputs">
          <textarea id="post-description" class="textarea" placeholder="Описание поста..." rows="4"></textarea>
           <div class="upload-area" id="upload-area">
            <label for="file-input" class="file-upload-label">
              <span id="upload-text">Перетащите изображение сюда или кликните для выбора</span>
              <input type="file" id="file-input" accept="image/*" style="display: none;">
            </label>
            <div id="image-preview" class="image-preview"></div>
          </div>
        </div>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
    `

        appEl.innerHTML = appHtml

        const fileInput = document.getElementById("file-input")
        const uploadArea = document.getElementById("upload-area")
        const imagePreview = document.getElementById("image-preview")
        const uploadText = document.getElementById("upload-text")
        const descriptionInput = document.getElementById("post-description")

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview" class="preview-image">`
                    uploadText.textContent = "Файл выбран: " + file.name
                }
                reader.readAsDataURL(file)
            }
        })

        uploadArea.addEventListener("dragover", (e) => {
            e.preventDefault()
            uploadArea.classList.add("dragover")
        })

        uploadArea.addEventListener("dragleave", () => {
            uploadArea.classList.remove("dragover")
        })

        uploadArea.addEventListener("drop", (e) => {
            e.preventDefault()
            uploadArea.classList.remove("dragover")
            const file = e.dataTransfer.files[0]
            if (file && file.type.match("image.*")) {
                fileInput.files = e.dataTransfer.files
                const reader = new FileReader()
                reader.onload = (event) => {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview" class="preview-image">`
                    uploadText.textContent = "Файл выбран: " + file.name
                }
                reader.readAsDataURL(file)
            }
        })

        document.getElementById("add-button").addEventListener("click", () => {
            const description = descriptionInput.value.trim()

            if (!fileInput.files[0]) {
                alert("Пожалуйста, выберите изображение")
                return
            }

            if (!description) {
                alert("Пожалуйста, введите описание поста")
                return
            }

            const imageUrl = fileInput.files[0]
                ? URL.createObjectURL(fileInput.files[0])
                : ""

            onAddPostClick({
                description: description,
                imageUrl: imageUrl,
            })
        })
    }

    render()
}
