import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
   name: 'ui',
   initialState: {
      modalOpen: false,
      currentPage: 1,
      itemsPerPage: 10,
   },
   reducers: {
      toggleModal: (state, action) => {
         state.modalOpen = action.payload;
      },
      setCurrentPage: (state, action) => {
         state.currentPage = action.payload;
      },
      setItemsPerPage: (state, action) => {
         state.itemsPerPage = action.payload;
      },
   },
});

export const { toggleModal, setCurrentPage, setItemsPerPage } = productsSlice.actions;
export default productsSlice.reducer;
