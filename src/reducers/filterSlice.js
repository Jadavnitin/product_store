import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   productAscOrder: [],
   productDscOrder: [],
   defaultProducts: [],
   totalApplyFilter:0
};

export const filterSlice = createSlice({
   name: 'filterPrice',
   initialState,
   reducers: {
      AscendingOrder: (state, action) => {
         state.productAscOrder = action.payload;
         state.productDscOrder = [];
         state.totalApplyFilter =  1; 
        
      },

      DecendingOrder: (state, action) => {
         state.productDscOrder = action.payload;
         state.productAscOrder = [];
          state.totalApplyFilter = 1; 
      },
      DefaultOrder: (state, action) => {
         state.defaultProducts = action.payload;
         state.productAscOrder = [];
         state.productDscOrder = [];
         state.totalApplyFilter = 0 ;
      }

   }
});

export const { AscendingOrder, DecendingOrder, DefaultOrder } = filterSlice.actions;
export default filterSlice.reducer;
