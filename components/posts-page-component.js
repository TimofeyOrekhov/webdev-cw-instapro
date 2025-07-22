import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // Динамический рендер постов из массива posts
  // Для форматирования даты можно использовать date-fns, но пока простой вариант
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "только что";
    if (diffMin < 60) return `${diffMin} минут назад`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} часов назад`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD} дней назад`;
  };

  const postsHtml = posts
    .map((post) => {
      const likesCount = post.likes.length;
      const isLiked = post.isLiked;
      return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/${
              isLiked ? "like-active" : "like-not-active"
            }.svg">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${likesCount}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${formatDate(post.createdAt)}
        </p>
      </li>
    `;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const postId = likeBtn.dataset.postId;
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (!user) {
        alert("Только авторизованные пользователи могут ставить лайки");
        return;
      }
      const token = `Bearer ${user.token}`;
      (posts[postIndex].isLiked ? dislikePost : likePost)({ postId, token })
        .then((updatedPost) => {
          posts[postIndex] = updatedPost;
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          alert(error.message || "Ошибка при изменении лайка");
        });
    });
  }
}
