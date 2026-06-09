import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить новый пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea 
              id="description-input" 
              class="input textarea" 
              placeholder="Введите описание..."
              rows="4"
            ></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Опубликовать</button>
            <button class="secondary-button" id="cancel-button">Отмена</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
        console.log("Image URL updated:", imageUrl);
        const addButton = document.getElementById("add-button");
        if (addButton) {
          addButton.disabled = !imageUrl || !description;
        }
      },
    });

    const descriptionInput = document.getElementById("description-input");
    const addButton = document.getElementById("add-button");
    const cancelButton = document.getElementById("cancel-button");
    const errorDiv = document.querySelector(".form-error");

    descriptionInput.addEventListener("input", (e) => {
      description = e.target.value;
      console.log("Description updated:", description);
      if (addButton) {
        addButton.disabled = !imageUrl || !description.trim();
      }
      if (errorDiv) {
        errorDiv.textContent = "";
      }
    });

    addButton.addEventListener("click", async () => {
      console.log("Add button clicked");
      console.log("Current imageUrl:", imageUrl);
      console.log("Current description:", description);
      
      if (!imageUrl) {
        errorDiv.textContent = "Пожалуйста, выберите изображение";
        return;
      }
      
      if (!description.trim()) {
        errorDiv.textContent = "Пожалуйста, введите описание";
        return;
      }

      addButton.disabled = true;
      addButton.textContent = "Публикация...";

      try {
        const postData = {
          description: description.trim(),
          imageUrl: imageUrl,
        };
        console.log("Sending post data:", postData);
        
        await onAddPostClick(postData);
        console.log("Post added successfully");
        goToPage(POSTS_PAGE);
      } catch (error) {
        console.error("Ошибка при добавлении поста:", error);
        errorDiv.textContent = error.message || "Ошибка при публикации";
        addButton.disabled = false;
        addButton.textContent = "Опубликовать";
      }
    });

    cancelButton.addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });
  };

  render();
}