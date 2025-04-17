import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../reducers/cartSlice'; 
import searchReducer from '../reducers/searchSlice';
import wishListReducer from "../reducers/wishListSlice"
import categoryReducer from "../reducers/categorySlice"
import filterPriceReducer from "../reducers/filterSlice"
import profileReducer from "../reducers/profileSlice"
import adminReducer from "../reducers/adminSlice"

export const store = configureStore({
   reducer: { 
      cart: cartReducer,
      search: searchReducer,
      wishList: wishListReducer,
      category: categoryReducer,
      filterPrice: filterPriceReducer,
      profile: profileReducer,
      admin: adminReducer,
   }
});