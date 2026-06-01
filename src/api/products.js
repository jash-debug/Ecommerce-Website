export const fetchAllProducts = async () => {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const fetchProductsByCategory = async (category) => {
  const response = await fetch(
    `https://fakestoreapi.com/products/category/${category}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch by category");
  }
  return response.json();
};

export const createProduct = async (newProduct) => {
  console.log("Creating product:", newProduct);
  const response = await fetch("https://fakestoreapi.com/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Failed to create product: ${response.status}`,
    );
  }
  const data = await response.json();
  console.log("Product created:", data);
  return data;
};

export const updateProduct = async (id, updates) => {
  console.log("Updating product:", id, updates);
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Failed to update product: ${response.status}`,
    );
  }
  const data = await response.json();
  console.log("Product updated:", data);
  return data;
};

export const deleteProduct = async (id) => {
  console.log("Deleting product:", id);
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
  const data = await response.json();
  console.log("Product deleted:", data);
  return data;
};
