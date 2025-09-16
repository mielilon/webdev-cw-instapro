import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea 
            id="description-input" 
            class="input" 
            placeholder="Описание фотографии"
            rows="4"
          ></textarea>
          <div class="form-error"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    // Рендерим заголовок страницы
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    // Функция для отображения ошибок
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    document.getElementById("add-button").addEventListener("click", () => {
      setError("");

      const description = document
        .getElementById("description-input")
        .value.trim();

      if (!description) {
        setError("Введите описание фотографии");
        return;
      }

      if (!imageUrl) {
        setError("Не выбрана фотография");
        return;
      }

      onAddPostClick({
        description,
        imageUrl,
      });
    });
  };

  render();
}
