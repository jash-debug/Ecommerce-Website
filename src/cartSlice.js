import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const findItem = (items, id) => items.find((item) => item.id === id);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const existingItem = findItem(state.items, product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image || "",
        quantity: 1,
      });
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = findItem(state.items, action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = findItem(state.items, action.payload);

      if (!item) {
        return;
      }

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (cartItem) => cartItem.id !== action.payload,
        );
        return;
      }

      item.quantity -= 1;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (subtotal, item) => subtotal + item.price * item.quantity,
    0,
  );

export default cartSlice.reducer;
