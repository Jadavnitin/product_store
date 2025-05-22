import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const LOCAL_OVERRIDES_KEY = 'product_overrides';
const LOCAL_CUSTOM_KEY = 'custom_products';
const LOCAL_DELETED_KEY = 'deleted_products'; 

export const fetchDefaultProducts = createAsyncThunk(
   'products/fetchDefaultProducts',
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get('https://dummyjson.com/products?limit=200');
         const defaultProducts = response.data.products;

  
         const deletedProducts = JSON.parse(localStorage.getItem(LOCAL_DELETED_KEY)) || [];

         const localOverrides = JSON.parse(localStorage.getItem(LOCAL_OVERRIDES_KEY)) || {};
         const customProducts = JSON.parse(localStorage.getItem(LOCAL_CUSTOM_KEY)) || [];

     
         const mergedDefaults = defaultProducts
            .filter(product => !deletedProducts.includes(product.id)) 
            .map((product) =>
               localOverrides[product.id] ? { ...product, ...localOverrides[product.id] } : product
            );

         return [...mergedDefaults, ...customProducts];
      } catch (err) {
         return rejectWithValue(err.response?.data || 'Error fetching products');
      }
   }
);

const saveOverridesToLocalStorage = (products) => {
   const overrides = {};
   products.forEach((p) => {
      if (typeof p.id === 'number') {
         overrides[p.id] = {
            title: p.title,
            category: p.category,
            price: p.price,
            image: p.image,
         };
      }
   });
   localStorage.setItem(LOCAL_OVERRIDES_KEY, JSON.stringify(overrides));
};

const saveCustomProductsToLocalStorage = (products) => {
   const custom = products.filter((p) => typeof p.id !== 'number');
   localStorage.setItem(LOCAL_CUSTOM_KEY, JSON.stringify(custom));
};

const saveDeletedProductsToLocalStorage = (deletedProducts) => {
   localStorage.setItem(LOCAL_DELETED_KEY, JSON.stringify(deletedProducts));
};

const productSlice = createSlice({
   name: 'product',
   initialState: {
      items: [],
      status: 'idle',
      error: null,
   },
   reducers: {
      updateProduct: (state, action) => {
         const updated = action.payload;
         const index = state.items.findIndex((item) => item.id === updated.id);
         if (index !== -1) {
            state.items[index] = updated;
            const isCustom = typeof updated.id !== 'number';
            isCustom ? saveCustomProductsToLocalStorage(state.items) : saveOverridesToLocalStorage(state.items);
            toast.success("Product updated successfully..");
         }
      },
      deleteProduct: (state, action) => {
         const deletedId = action.payload;
         state.items = state.items.filter((item) => item.id !== deletedId);

         const deletedProducts = JSON.parse(localStorage.getItem(LOCAL_DELETED_KEY)) || [];

  
         deletedProducts.push(deletedId);

      
         saveDeletedProductsToLocalStorage(deletedProducts);

         const updatedOverrides = JSON.parse(localStorage.getItem(LOCAL_OVERRIDES_KEY)) || {};
         const updatedCustomProducts = JSON.parse(localStorage.getItem(LOCAL_CUSTOM_KEY)) || [];

         delete updatedOverrides[deletedId];

         const updatedCustom = updatedCustomProducts.filter((product) => product.id !== deletedId);

       
         localStorage.setItem(LOCAL_OVERRIDES_KEY, JSON.stringify(updatedOverrides));
         localStorage.setItem(LOCAL_CUSTOM_KEY, JSON.stringify(updatedCustom));
      },
      addProduct: (state, action) => {
         
         const {id}=action.payload
         
         const newProduct = { ...action.payload, id:`${id}` };
         state.items.push(newProduct);
         saveCustomProductsToLocalStorage(state.items);
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchDefaultProducts.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchDefaultProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
         })
         .addCase(fetchDefaultProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
         });
   },
});

export const { updateProduct, deleteProduct, addProduct } = productSlice.actions;
export default productSlice.reducer;
