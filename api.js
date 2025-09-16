// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({ userId, token }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  const requestBody = {
    login,
    password,
    name,
  };

  // Добавляем imageUrl только если он есть
  if (imageUrl) {
    requestBody.imageUrl = imageUrl;
  }

  return fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify(requestBody),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
        throw new Error("Такой пользователь уже существует");
      });
    }
    if (response.status === 201) {
      return response.json();
    }
    if (!response.ok) {
      throw new Error(
        `Ошибка при регистрации: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      return response.json().then((errorData) => {
        throw new Error("Неверный логин или пароль");
      });
    }
    if (response.status === 201) {
      return response.json();
    }
    if (!response.ok) {
      throw new Error(
        `Ошибка при входе: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch("https://wedev-api.sky.pro/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Ошибка при загрузке изображения: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  });
}

// Добавить новый пост
export function addPost({ description, imageUrl, token }) {
  const requestBody = {
    description,
    imageUrl,
  };

  console.log("API запрос:", {
    url: postsHost,
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: requestBody,
  });

  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify(requestBody),
  }).then((response) => {
    console.log("Ответ API:", response.status, response.statusText);

    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (response.status === 400) {
      return response.json().then((errorData) => {
        console.log("Детали ошибки 400:", errorData);
        throw new Error("Неверные данные поста");
      });
    }
    if (response.status === 201) {
      return response.json();
    }
    if (!response.ok) {
      throw new Error("Ошибка при добавлении поста");
    }
    return response.json();
  });
}

// Поставить лайк
export function likePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      throw new Error("Ошибка при постановке лайка");
    }
    return response.json();
  });
}

// Убрать лайк
export function dislikePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      throw new Error("Ошибка при удалении лайка");
    }
    return response.json();
  });
}

// Удалить пост
export function deletePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (!response.ok) {
      throw new Error("Ошибка при удалении поста");
    }
    return response.json();
  });
}
