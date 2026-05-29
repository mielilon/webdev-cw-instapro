// api.js - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ

const personalKey = "prod";
const baseHost = "https://webdev-hw-api.vercel.app";
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
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("getPosts response:", data);
      return data.posts || [];
    });
}

export function getUserPosts({ token, userId }) {
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
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("getUserPosts response:", data);
      const allPosts = data.posts || [];
      return allPosts.filter(post => post.user?.id === userId);
    });
}

export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });
}

export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });
}

export function addPost({ token, description, imageUrl }) {
  if (!description || !imageUrl) {
    return Promise.reject(new Error("Описание и изображение обязательны"));
  }

  console.log("Sending post data:", { description, imageUrl });

  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    }),
  })
    .then(async (response) => {
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);
      
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      if (response.status === 400) {
        throw new Error("Неверные данные поста");
      }
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${responseText}`);
      }
      
      try {
        return JSON.parse(responseText);
      } catch (e) {
        return { success: true };
      }
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  })
    .then(async (response) => {
      const responseText = await response.text();
      console.log("Register response:", response.status, responseText);
      
      if (response.status === 400) {
        throw new Error("Такой пользователь уже существует");
      }
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      // Возвращаем пользователя в правильном формате
      return { user: data.user };
    });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then(async (response) => {
      const responseText = await response.text();
      console.log("Login response:", response.status, responseText);
      
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      if (response.status === 401) {
        throw new Error("Не авторизован");
      }
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log("Parsed login data:", data);
      // Возвращаем пользователя в правильном формате
      return { user: data.user };
    });
}

export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка загрузки изображения: ${response.status}`);
    }
    return response.json();
  });
}