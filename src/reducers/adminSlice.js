import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const updateLocalStorage = (state) => {
   localStorage.setItem("admin", JSON.stringify(state.admin));
   localStorage.setItem("isAdminAuthenticated", state.isAdminAuthenticated.toString());
};

const getLocalStorageState = () => {
   return {
      admin: JSON.parse(localStorage.getItem("admin")) || [],
      isAdminAuthenticated: localStorage.getItem("isAdminAuthenticated") === "true",
   };
};

const initialState = getLocalStorageState();

const adminSlice = createSlice({
   name: "admin",
   initialState,
   reducers: {
      adminSignUp: (state, action) => {
         const { email, password } = action.payload;

         if (state.admin.some(admin => admin.email === email)) {
            return;
         }

         const newAdmin = { email, password};
         state.admin.push(newAdmin);

         updateLocalStorage(state);
      },
      adminLogin: (state, action) => {
         const { email, password } = action.payload;
         const admin = state.admin.find(admin => admin.email === email);

         if (admin && admin.password === password) {
            state.isAdminAuthenticated = true;
            updateLocalStorage(state);
         }
      },

      adminLogout: (state) => {
         state.isAdminAuthenticated = false;
      },
   },
});

export const { adminSignUp, adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
