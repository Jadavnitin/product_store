import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
   name: "search",
   initialState: { searchWord: "" },
   reducers: {
      searchFunctionality(state,action) {
         state.searchWord = action.payload;
      }
   }
})

export const { searchFunctionality } = searchSlice.actions;

export default searchSlice.reducer;
