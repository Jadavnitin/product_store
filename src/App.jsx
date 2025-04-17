import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom';
import ProductCardDetails from './components/ProductCardDetails';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ProtectedRoute from './routes/ProtectedRoute';
import WishList from './components/WishList';
import CheckoutPage from './components/CheckoutPage';
import MyProfile from './components/MyProfile';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminSignUp from './pages/AdminSignUp';
import AdminSignIn from './pages/AdminSignIn';
import AdminProtectedRoute from './routes/AdminProtectedRoute';







const App = () => {



  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<HomePage />} />
           
            <Route path='/productdetails/:id' element={<ProductCardDetails />} />
            <Route path='/wishlist' element={<WishList />} />
            <Route path='/checkoutpage' element={<CheckoutPage />} />
            <Route path ="/myprofile" element={<MyProfile/>} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path='/admin' element={<AdminPage />} />
          </Route>
          
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/adminsignup' element={<AdminSignUp/>} />
          <Route path='/adminsignin' element={<AdminSignIn />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
