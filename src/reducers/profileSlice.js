import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const updateLocalStorage = (state) => {
   localStorage.setItem("users", JSON.stringify(state.users));
   localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
   localStorage.setItem("isAuthenticated", state.isAuthenticated.toString());
};

const getLocalStorageState = () => {
   return {
      users: JSON.parse(localStorage.getItem("users")) || [],
      currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
      isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
   };
};

const initialState = getLocalStorageState();

const profileSlice = createSlice({
   name: "profile",
   initialState,
   reducers: {
      signUp: (state, action) => {
         const { email, password, firstName, lastName, address, profileImage } = action.payload;

         if (state.users.some(user => user.email === email)) {
            return;
         }
       
         const newUser = { email, password, firstName, lastName, address, profileImage };
         state.users.push(newUser);

         updateLocalStorage(state);
      },
      login: (state, action) => {
         const { email, password } = action.payload;
         const user = state.users.find(user => user.email === email);

         if (user && user.password === password) {
            state.currentUser = user;
            state.isAuthenticated = true;
            updateLocalStorage(state);
         }
      },

      logout: (state) => {
         state.currentUser = null;
         state.isAuthenticated = false;
      },

      updateProfile: (state, action) => {
         if (state.currentUser) {
            const { firstName, lastName, address, email, profileImage } = action.payload;
            const oldEmail = state.currentUser.email;

            if (email !== oldEmail && state.users.some(user => user.email === email)) {
               toast.error("Email is already in use by another account!");
               return;
            }

            state.currentUser = { ...state.currentUser, firstName, lastName, address, email, profileImage };
            state.users = state.users.map(user =>
               user.email === oldEmail ? { ...user, firstName, lastName, address, email, profileImage } : user
            );

            updateLocalStorage(state);
         }
      },
   },
});

export const { signUp, login, logout, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
