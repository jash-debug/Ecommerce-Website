const parseAuthResponse = async (response, fallbackMessage) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

const normalizeAuthUser = (rawUser) => {
  if (!rawUser) {
    return null;
  }

  return {
    ...rawUser,
    role: rawUser.role || rawUser.user?.role,
  };
};

const fetchUserProfileById = async (id) => {
  if (!id) {
    return null;
  }

  try {
    const response = await fetch(`https://dummyjson.com/users/${id}`);
    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
};

export const loginWithCredentials = async (credentials) => {
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    }),
    credentials: "include",
  });

  const data = await parseAuthResponse(response, "Login failed");
  let normalizedUser = normalizeAuthUser(data);

  if (!normalizedUser?.role && normalizedUser?.id) {
    const profile = await fetchUserProfileById(normalizedUser.id);
    if (profile?.role) {
      normalizedUser = {
        ...normalizedUser,
        role: profile.role,
      };
    }
  }

  if (!normalizedUser?.role) {
    normalizedUser = {
      ...normalizedUser,
      role: "user",
    };
  }

  return {
    ...normalizedUser,
    authFlow: credentials.intent || "signin",
  };
};

export const signupWithUserData = async (userData) => {
  const response = await fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      age: Number(userData.age),
      gender: userData.gender,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      image: userData.image,
      phone: userData.phone,
    }),
  });

  const data = await parseAuthResponse(response, "Signup failed");
  const normalizedUser = {
    ...normalizeAuthUser(data),
    role: data?.role || "user",
  };

  return {
    ...normalizedUser,
    authFlow: "signup",
  };
};
