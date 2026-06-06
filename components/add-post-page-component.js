import { renderUploadImageComponent } from "./upload-image-component.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // Переменная для динамического сохранения ссылки на загруженное фото
    let imageUrl = "";

    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить новый пост</h3>
        
        <!-- Сюда встроенный метод смонтирует кнопку выбора файла и превью -->
        <div class="upload-image-container"></div>
        
        <div class="form-inputs">
          <p class="form-label">Опишите фотографию:</p>
          <textarea 
            class="input textarea" 
            id="description-input" 
            rows="4" 
            placeholder="Введите описание поста..."
          ></textarea>
        </div>
        
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    // 1. Находим контейнер и запускаем в нем готовый компонент загрузки фото
    const uploadImageContainer = document.querySelector(
      ".upload-image-container",
    );
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          // Как только облако вернет ссылку на картинку, сохраняем её в переменную
          imageUrl = newImageUrl;
        },
      });
    }

    // 2. Навешиваем обработчик клика на кнопку отправки
    document.getElementById("add-button").addEventListener("click", () => {
      const descriptionInput = document.getElementById("description-input");

      // Простая валидация перед отправкой, чтобы бэкенд не ругался ошибками 400
      if (!imageUrl) {
        alert("Пожалуйста, выберите и загрузите фотографию");
        return;
      }

      if (!descriptionInput.value.trim()) {
        alert("Пожалуйста, добавьте описание к посту");
        return;
      }

      // Передаем наверх реальные данные вместо старых текстовых заглушек
      onAddPostClick({
        description: descriptionInput.value,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
