import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  fetchUsers,
  PAGE_LIMIT,
  searchUsers,
  updateUser,
} from "../api/users";

export const useGetUsers = ({ page = 1, search = "" } = {}) => {
  const skip = (page - 1) * PAGE_LIMIT;
  return useQuery({
    queryKey: ["users", { page, search }],
    queryFn: () =>
      search
        ? searchUsers({ q: search, limit: PAGE_LIMIT, skip })
        : fetchUsers({ limit: PAGE_LIMIT, skip }),
    placeholderData: (prev) => prev,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
