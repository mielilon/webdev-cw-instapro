import { renderHeaderComponent } from "./header-component.js";
import { uploadImage } from "../api.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста

    // СДЕЛАНО
    /**
     * REVIEW:
     * app - чаще всего это корневой элемент приложения,
     * а эта функция рендерит СТРАНИЦУ, поэтому называть
     * переменную appHtml некорректно. Это должен быть pageHtml.
     */
    let appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        
        <h3 class="form-title">Добавить пост</h3><div class="form-inputs">
          <div class="upload-image-container"> 
          <div class="upload-image">
            <label class="file-upload-label secondary-button">
            <span class="icon">📷</span>
            <span class="label-text text">Выберите фото</span>
                <input type="file"  id="photoInput" class="file-upload-input" hidden>
            </label>
          </div>
          </div>
          <label class = "page-label">
            Опишите фотографию:
            <textarea class="input textarea input-textarea" rows="4"></textarea>
            </label>
            <button class="button add-photo-button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    let headerContainer = document.querySelector(".header-container");

    renderHeaderComponent({ element: headerContainer });

    let fileInput = document.querySelector(".file-upload-input");

    let inputLabel = document.querySelector(".file-upload-label");
    let uploadImageBlock = document.querySelector(".upload-image");

    let imageUrl = "";
    let image = document.createElement("img");
    image.classList.add("file-upload-image");

    // REVIEW: 
    // Лучше назвать более специфично, относительно того, что делает эта
    // кнопка - она меняет фото, значит лучше назвать changePhotoButton.
    let changeButton = document.createElement("button");
    changeButton.textContent = "Заменить фото";
    changeButton.classList.add("file-upload-remove-button", "button");

    async function handleFileChange(event) {
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      const result = await uploadImage({ file });

      image.src = result.fileUrl;
      imageUrl = result.fileUrl;

      if (!uploadImageBlock.contains(image)) {
        inputLabel.style.display = "none";

        uploadImageBlock.prepend(image);
        uploadImageBlock.append(changeButton);
      }

      inputLabel.style.display = "none";
      uploadImageBlock.style.display = "flex";
      uploadImageBlock.style.alignItems = "center";
    }

    fileInput?.addEventListener("change", handleFileChange);

    changeButton?.addEventListener("click", () => {
      image.remove();
      changeButton.remove();

      inputLabel.style.display = "inline-block";
      fileInput.value = "";
    });

    document.getElementById("add-button").addEventListener("click", () => {
      let textAreaValue = document.querySelector(".input-textarea").value;

      onAddPostClick({
        description: textAreaValue,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
