import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { login, logout } from "./profileSlice";

const getUserEmail = () => {
   const user = JSON.parse(localStorage.getItem("currentUser"));
   return user?.email || "guest";
};

const localstoreWishlist = () => {
   const email = getUserEmail();
   const stored = localStorage.getItem(`wishlist_${email}`);
   return stored
      ? JSON.parse(stored)
      : { totalWishListCount: 0, wishListItems: [] };
};

const storeUpdatedStateInLocal = (state) => {
   const email = getUserEmail();
   localStorage.setItem(`wishlist_${email}`, JSON.stringify(state));
};

export const wishListSlice = createSlice({
   name: "wishList",
   initialState: localstoreWishlist(),
   reducers: {
      addWishListCart(state, action) {
         const { id } = action.payload;
         const existing = state.wishListItems.find((item) => item.id === id);

         if (existing) {
            state.wishListItems = state.wishListItems.filter(
               (item) => item.id !== id
            );
            state.totalWishListCount--;
            toast.success("Product removed from wishlist");
         } else {
            state.totalWishListCount++;
            state.wishListItems.push({ ...action.payload, isWishListActive: true });
            toast.success("Product added to wishlist");
         }

         storeUpdatedStateInLocal(state);
      },

      removeWishListItem(state, action) {
         state.wishListItems = state.wishListItems.filter(
            (item) => item.id !== action.payload
         );
         state.totalWishListCount--;
         storeUpdatedStateInLocal(state);
      },
   },

   extraReducers: (builder) => {
      builder
         .addCase(login, (state, action) => {
            const email = action.payload.email;
            const stored = localStorage.getItem(`wishlist_${email}`);
            return stored
               ? JSON.parse(stored)
               : { totalWishListCount: 0, wishListItems: [] };
         })
         .addCase(logout, () => {
            const email = getUserEmail();
            const stored = localStorage.getItem(`wishlist_${email}`);
            return stored
               ? JSON.parse(stored)
               : { totalWishListCount: 0, wishListItems: [] };
         });
   },
});

export const { addWishListCart, removeWishListItem } = wishListSlice.actions;
export default wishListSlice.reducer;
