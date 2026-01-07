import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  // Переменная хранения ссылки на фото
  let imageUrl = "";

  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    // Основная разметка страницы
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            
            <label>
              Опишите фотографию:
              <textarea class="input textarea" id="description-input" rows="4"></textarea>
            </label>
            
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    // Шапка одна для всех страниц
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Рендер формы выбора изображения в его контейнер
    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          // Сохраняем ссылку из загрузки
          imageUrl = newImageUrl; 
        },
      });
    }

    // Сбор данных и вызов callback-функции
    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value;

      // Валидация: картинка выбрана, описание заполнено
      if (!imageUrl) {
        alert("Пожалуйста, выберите фото");
        return;
      }
      if (!description) {
        alert("Пожалуйста, добавьте описание");
        return;
      }

      // Если всё ок, вызываем функцию из index.js
      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
