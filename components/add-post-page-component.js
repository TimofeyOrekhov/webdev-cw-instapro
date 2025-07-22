import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h3>Добавить пост</h3>
      <div class="form">
        <div class="upload-image-container"></div>
        <textarea id="description-input" class="input" placeholder="Описание поста" rows="3"></textarea>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

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
