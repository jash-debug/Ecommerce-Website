import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginWithCredentials, signupWithUserData } from "../api/auth";
import { setAuthFailure, setAuthPending, setAuthSuccess } from "../authSlice";

export const useLoginUser = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginWithCredentials,
    onMutate: () => {
      dispatch(setAuthPending());
    },
    onSuccess: (data) => {
      dispatch(setAuthSuccess(data));
    },
    onError: (error) => {
      dispatch(setAuthFailure(error?.message || "Login failed"));
    },
  });
};

export const useSignupUser = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: signupWithUserData,
    onMutate: () => {
      dispatch(setAuthPending());
    },
    onSuccess: (data) => {
      dispatch(setAuthSuccess(data));
    },
    onError: (error) => {
      dispatch(setAuthFailure(error?.message || "Signup failed"));
    },
  });
};
