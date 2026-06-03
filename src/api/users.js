const BASE_URL = "https://dummyjson.com/users";
export const PAGE_LIMIT = 10;

export const fetchUsers = async ({ limit = PAGE_LIMIT, skip = 0 } = {}) => {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json(); // { users, total, skip, limit }
};

export const searchUsers = async ({ q, limit = PAGE_LIMIT, skip = 0 }) => {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
  );
  if (!response.ok) throw new Error("Failed to search users");
  return response.json(); // { users, total, skip, limit }
};

export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create user: ${response.status}`);
  }
  return response.json();
};

export const updateUser = async (id, updates) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update user: ${response.status}`);
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
  return response.json();
};
