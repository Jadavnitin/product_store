import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
   name: 'category',
   initialState: {
      category: [],
      selectedCategory:""
   },
   reducers: {
      filterCategory: (state, action) => {
         state.category = action.payload;   
      },
      selectedFilterCategory: (state, action) => {
         state.selectedCategory = action.payload;   
      }
   }
});

export const { filterCategory, selectedFilterCategory } = categorySlice.actions;

export default categorySlice.reducer;
