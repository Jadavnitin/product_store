import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { login, logout } from "./profileSlice";

const getUserEmail = () => {
   const user = JSON.parse(localStorage.getItem("currentUser"));
   return user?.email || "guest";
};

const localStorageToCart = () => {
   const email = getUserEmail();
   const storedCart = localStorage.getItem(`cart_${email}`);
   return storedCart
      ? JSON.parse(storedCart)
      : { cartItems: [], totalCount: 0, totalPrice: 0 };
};

const saveCartToLocalStorage = (state) => {
   const email = getUserEmail();
   localStorage.setItem(`cart_${email}`, JSON.stringify(state));
};

const totalPriceCalculated = (cartItems) => {
   return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const cartSlice = createSlice({
   name: "cart",
   initialState: localStorageToCart(),
   reducers: {
      addToCart(state, action) {
         const { id } = action.payload;
         const existingItem = state.cartItems.find((item) => item.id === id);

         if (existingItem) {
            existingItem.quantity++;
         } else {
            state.cartItems.push({ ...action.payload, quantity: 1 });
            state.totalCount++;
         }

         state.totalPrice = totalPriceCalculated(state.cartItems);
         saveCartToLocalStorage(state);
         toast.success("Product added successfully");
      },

      incrementCartItems(state, action) {
         const item = state.cartItems.find((i) => i.id === action.payload);
         if (item) {
            item.quantity++;
            state.totalPrice = totalPriceCalculated(state.cartItems);
            saveCartToLocalStorage(state);
         }
      },

      decrementCartItems(state, action) {
         const item = state.cartItems.find((i) => i.id === action.payload);

         if (item && item.quantity > 1) {
            item.quantity--;
         } else {
            state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
            state.totalCount--;
            toast.success("Product removed successfully");
         }

         state.totalPrice = totalPriceCalculated(state.cartItems);
         saveCartToLocalStorage(state);
      },
   },

   extraReducers: (builder) => {
      builder
         .addCase(login, (state, action) => {
            const email = action.payload.email;
            const storedCart = localStorage.getItem(`cart_${email}`);
            return storedCart
               ? JSON.parse(storedCart)
               : { cartItems: [], totalCount: 0, totalPrice: 0 };
         })
         .addCase(logout, () => {
            const email = getUserEmail();
            const storedCart = localStorage.getItem(`cart_${email}`);
            return storedCart
               ? JSON.parse(storedCart)
               : { cartItems: [], totalCount: 0, totalPrice: 0 };
         });
   },
});

export const { addToCart, incrementCartItems, decrementCartItems } = cartSlice.actions;
export default cartSlice.reducer;
