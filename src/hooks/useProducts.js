import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProductsByCategory,
  updateProduct,
} from "../api/products";

export const useGetAllProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
  });

export const useGetProductsByCategory = (category) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProductsByCategory(category),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData ? [...oldData, newProduct] : [newProduct],
      );
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData
          ? oldData.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product,
            )
          : [updatedProduct],
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["products"], (oldData) =>
        oldData ? oldData.filter((product) => product.id !== deletedId) : [],
      );
    },
  });
};
