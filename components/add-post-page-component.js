import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  // Сюда компонент загрузки положит URL картинки
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="upload-image-container"></div>
          <textarea
            class="input textarea"
            id="description-input"
            rows="4"
            placeholder="Описание поста"
          ></textarea>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    // Шапка — как на остальных страницах
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Готовый компонент загрузки картинки (как в регистрации)
    renderUploadImageComponent({
      element: document.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value;

      // Проверка: должны быть и текст, и картинка (пункт тест-плана)
      if (!description) {
        alert("Введите описание поста");
        return;
      }
      if (!imageUrl) {
        alert("Загрузите картинку");
        return;
      }

      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
