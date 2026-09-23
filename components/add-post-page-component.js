import { uploadImage } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container">
              ${
                imageUrl
                  ? `
                  <div class="file-upload-image-container">
                    <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
                    <button class="file-upload-remove-button button">Заменить фото</button>
                  </div>
                  `
                  : `
                  <label class="file-upload-label secondary-button">
                    <input type="file" class="file-upload-input" style="display:none" />
                    Выберите фото
                  </label>
                  `
              }
            </div>
            <textarea
              class="input"
              id="description-input"
              placeholder="Опишите вашу фотографию"
              rows="4"
            ></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button" ${!imageUrl ? "disabled" : ""}>
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const fileInput = appEl.querySelector(".file-upload-input");
    const labelEl = appEl.querySelector(".file-upload-label");

    fileInput?.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (labelEl) {
        labelEl.setAttribute("disabled", true);
        labelEl.textContent = "Загружаю файл...";
      }

      uploadImage({ file })
        .then(({ fileUrl }) => {
          imageUrl = fileUrl;
          render();
        })
        .catch((error) => {
          console.error(error);
          if (labelEl) {
            labelEl.removeAttribute("disabled");
            labelEl.textContent = "Выберите фото";
          }
          alert("Не удалось загрузить фото");
        });
    });

    appEl
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        render();
      });

    appEl.querySelector("#add-button")?.addEventListener("click", () => {
      const description = appEl
        .querySelector("#description-input")
        .value.trim();

      if (!imageUrl) return alert("Загрузите фотографию");
      if (!description) return alert("Добавьте описание");

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}