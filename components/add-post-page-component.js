import { renderUploadImageComponent } from "./upload-image-component.js";
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
          <div class="upload-image-container"></div>
          <label>
            Опишите фотографию:
            <textarea id="description-input" class="input textarea" placeholder="Описание поста" rows="3"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    // Рендерим шапку
    renderHeaderComponent({
      element: appEl.querySelector(".header-container"),
    });

    // Рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      // Сначала проверяем наличие изображения
      if (!imageUrl) {
        alert("Загрузите изображение");
        return;
      }
      const description = document
        .getElementById("description-input")
        .value.trim();
      if (!description) {
        alert("Введите описание поста");
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
