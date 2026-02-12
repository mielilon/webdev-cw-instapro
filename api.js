const personalKey = ":veronika-milya";
const baseUrlImg = "https://webdev-hw-api.vercel.app/api";
const baseHost = "https://wedev-api.sky.pro/api";
const baseUrl = `${baseHost}/v1/${personalKey}/instapro`;

export async function getPostsUser(id) {
  const response = await fetch(baseUrl + "/user-posts/" + id);
  const data = await response.json();
  return data.posts;
}

export async function getPosts({ token }) {
  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
  if (response.status === 401) {
    throw new Error("Нет авторизации");
  }
  const data = await response.json();
  return data.posts;
}

export async function createPost({ token, imageUrl, description }) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  });
  if (response.status != 201) {
    throw new Error("Не удалось добавить пост");
  }
  return await response.json();
}

export async function deletePost({ token, id }) {
  const response = await fetch(baseUrl + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });
  if (response.status != 200) {
    throw new Error("Не удалось удалить пост");
  }
  return await response.json();
}

export async function addLike({ token, id }) {
  const response = await fetch(baseUrl + "/" + id + "/like", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });
  if (response.status != 200) {
    alert("Авторизуйтесь, чтобы поставить лайк");
    throw new Error("Не удалось поставить лайк");
  }
  return await response.json();
}

export async function disLike({ token, id }) {
  const response = await fetch(baseUrl + "/" + id + "/dislike", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });
  if (response.status != 200) {
    alert("Авторизуйтесь, чтобы убрать лайк");
    throw new Error("Не удалось убрать лайк");
  }
  return await response.json();
}

export async function registerUser({ login, password, name, imageUrl }) {
  const response = await fetch(baseHost + "/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  });
  if (response.status === 400) {
    throw new Error("Такой пользователь уже существует");
  }
  return await response.json();
}

export async function loginUser({ login, password }) {
  const response = await fetch(baseHost + "/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
  if (response.status === 400) {
    throw new Error("Неверный логин или пароль");
  }
  return await response.json();
}

export async function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  const response = await fetch(baseUrlImg + "/upload/image", {
    method: "POST",
    body: data,
  });
  return await response.json();
}
