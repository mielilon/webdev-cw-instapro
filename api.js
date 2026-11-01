// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "Platina77";
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

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

//Добавляем пост в API
export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({ description, imageUrl }),
  }).then((response) => {
    if (response.status !== 201) {
      if (response.status === 400) {
        throw new Error("не передано описание, фотография или описание пустое");
      }
      if (response.status === 401) {
        throw new Error("Пользователь не авторизован");
      }
      throw new Error("Ошибка сервера");
    }
    return response.json();
  });
}

//Ставим лайк
export function addLike({ token, id }) {
  return fetch(`${postsHost}/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        /*       if (response.status === 400) {
        throw new Error("не передано описание, фотография или описание пустое");
      } */
        if (response.status === 401) {
          throw new Error("Авторизуйтесь, пожалуйста");
        }
        throw new Error("Ошибка сервера");
      }
      return response.json();
    })
    .then((data) => {
      return data.post;
    });
}

//Убираем лайк
export function dislike({ token, id }) {
  return fetch(`${postsHost}/${id}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        if (response.status === 401) {
          throw new Error("Авторизуйтесь, пожалуйста");
        }
        throw new Error("Ошибка сервера");
      }
      return response.json();
    })
    .then((data) => {
      return data.post;
    });
}

export function getUserPosts({ token, id }) {
  const headers = {};

  if (token !== undefined) {
    headers.Authorization = token;
  }
  return fetch(`${postsHost}/user-posts/${id}`, {
    method: "GET",

    headers,
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Ошибка сервера");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
