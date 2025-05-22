import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaBars, FaHeart, FaMinus, FaPlus, FaShoppingCart, FaTimes } from "react-icons/fa";
import Badge from '@mui/material/Badge';
import { styled as muiStyled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux';
import { decrementCartItems, incrementCartItems } from '../reducers/cartSlice';

import { useNavigate } from 'react-router-dom';
import {  ToastContainer } from 'react-toastify';
import { logout } from '../reducers/profileSlice';
import { useLocation } from 'react-router-dom';
import { adminLogout } from '../reducers/adminSlice';






const ProductNavbar = () => {


  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");

  
  const cartCount = useSelector((state) => state.cart.totalCount);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalWishListCount = useSelector((state) => state.wishList.totalWishListCount);
  const currentUser = useSelector((state) => state.profile.currentUser);



  const dispatch = useDispatch();


  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const toggleCartDropdown = () => {
    setIsCartOpen(!isCartOpen);
  }

  const handlerCartItemsIncrease = (id) => {
    dispatch(incrementCartItems(id))
  }
  const handlerCartItemsDecrease = (id) => {
    dispatch(decrementCartItems(id));

  }

  

  const hanlderWishList = () => {
    navigate("/wishlist")
  }

  const handlerCheckout = () => {
    navigate("/checkoutpage");
  }

  const handlerProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const hanlderMyProfile = () => {
    navigate("/myprofile");
  }
  
  const handlerAdmin = () => {
    navigate("/admin");
  }
  
  const handleLogout = () => {
   
    if (isAdminPage) {
      dispatch(adminLogout())
      navigate("/adminsignin");
    } else {
      dispatch(logout());
      navigate("/signin");
    }
  };

  const handlerUser = () => {
    navigate("/");
  }
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isProfileBtn = e.target.closest(".profile-toggle");
      const isProfileDropdown = e.target.closest(".profile-dropdown");

      if (!isProfileBtn && !isProfileDropdown) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  
  return (
    <>

      <ToastContainer position="top-center" autoClose={1000} pauseOnFocusLoss />
      <ProductContainer>
        <LogoAndSearchContainer>
          <img src={Logo} alt="Logo" />
        </LogoAndSearchContainer>

        
        <MenuButton onClick={toggleDropdown} style={{ color: "white" }}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>

        <DropdownMenu $isOpen={isOpen}>


          <CloseButton onClick={closeDropdown}>✕</CloseButton>

        
          <SmallIconContainer>
            
            {!isAdminPage && (
              <>
                <IconButton aria-label="wishlist">
                  <StyledBadge badgeContent={totalWishListCount} color="secondary" onClick={hanlderWishList}>
                    <FaHeart />
                  </StyledBadge>
                </IconButton>

              
                <IconButton aria-label="cart">
                  <StyledBadge badgeContent={cartCount} color="secondary">
                    <FaShoppingCart onClick={toggleCartDropdown} />
                  </StyledBadge>
                </IconButton>
              </>
            )}


            <ProfileContainer onClick={hanlderMyProfile}>
              <img src={currentUser?.profileImage || "/src/assets/logo.png"} alt="profile-img" />
            </ProfileContainer>

          </SmallIconContainer>

        </DropdownMenu>
        <IconContainer>
          
          {!isAdminPage && (
            <>
              <IconButton aria-label="wishlist">
                <StyledBadge badgeContent={totalWishListCount} color="secondary" onClick={hanlderWishList}>
                  <FaHeart />
                </StyledBadge>
              </IconButton>


              <IconButton aria-label="cart">
                <StyledBadge badgeContent={cartCount} color="secondary">
                  <FaShoppingCart onClick={toggleCartDropdown} />
                </StyledBadge>
              </IconButton>
            </>
          )}

          <ProfileContainer onClick={handlerProfile}>
            <img src={currentUser?.profileImage || "/src/assets/logo.png"} alt="profile-img" />
          </ProfileContainer>

        </IconContainer>


        <ProfileDropdownMenu $isprofileopen={isProfileOpen} className="profile-dropdown">
          <ProfileDropdownItem onClick={hanlderMyProfile}>My Profile</ProfileDropdownItem>
          
          <ProfileDropdownItem onClick={isAdminPage ? handlerUser : handlerAdmin}>
            {isAdminPage ? "User" : "Admin"}
          </ProfileDropdownItem>

          <ProfileDropdownItem onClick={handleLogout}>Logout</ProfileDropdownItem>
        </ProfileDropdownMenu>


        <CartDropDown $isCartOpen={isCartOpen}>
          <CartCloseButton onClick={toggleCartDropdown}>
            <FaTimes />
          </CartCloseButton>

          {cartItems.length > 0 ? (<CartItems>
            {cartItems.map((cartItem) => (
              <CartItem key={cartItem.id}>
                <ItemImage src={(Array.isArray(cartItem?.images) && cartItem.images[0]) || cartItem.image} alt={cartItem.title} />
                <ItemDetails>
                  <h4>{cartItem.title}</h4>
                  <p>${cartItem.price}</p>
                  <QuantityControls>
                    <QuantityButton onClick={() => handlerCartItemsDecrease(cartItem.id)}>
                      <FaMinus />
                    </QuantityButton>
                    <span>{cartItem.quantity}</span>
                    <QuantityButton onClick={() => handlerCartItemsIncrease(cartItem.id)}>
                      <FaPlus />
                    </QuantityButton>
                  </QuantityControls>
                </ItemDetails>
              </CartItem>
            ))}
          </CartItems>
          ) : (<EmptyCartItemsContainer><EmptyCartItems>Your cart is empty.</EmptyCartItems></EmptyCartItemsContainer>)}

          <TotalContainer>
            <span>Total:</span>
            <strong>${Math.round(totalPrice * 100) / 100}</strong>
          </TotalContainer>

          <CheckoutButton onClick={handlerCheckout}>Checkout</CheckoutButton>
        </CartDropDown>


      </ProductContainer>

    </>
  )
}
export default ProductNavbar

const ProfileDropdownItem = styled.div`
  padding: 12px 15px;
  font-size: 15px;
  width:100%;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #444;
  gap:0.35rem;
  color: white;

  &:hover {
    background: #333;
    color: #fff;
  }
`;


const ProfileDropdownMenu = styled.div`
  display: ${({ $isprofileopen }) => ($isprofileopen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: #282828;
  color: white;
  width:200px;
  position: absolute;
  top:102px;
  right:5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem;
  transition: all 0.4s ease-in-out;
  z-index: 999;

`;


const ProfileContainer = styled.div`
height:2.25rem;
width:2.25rem;
border-radius:100%;
border: none;
cursor: pointer;

img{
  height:2.25rem;
  width:2.25rem;
  object-fit: cover;
  border-radius:100%;
}
`;


const EmptyCartItems = styled.h1`
font-size:1.25rem;
font-weight: 900;
color: black;

`;

const EmptyCartItemsContainer = styled.div`
display: flex;
height:80%;
align-items: center;
justify-content:center;
`;




const ProductContainer = styled.div`
  background-color: #212121;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height:100px;
  width: 100%;
  top: 0;
  z-index: 10;
  position: fixed;
  padding: 0 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    padding: 0 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: row;
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    gap: 1rem;
   
    
  }
`;


const LogoAndSearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width:65px;
    height: auto;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }

`;


const SmallIconContainer = styled.div`
  display:none;
  align-items: center;
  gap: 1rem;

  svg {
    color: white;
    font-size: 1.5rem;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
   
  
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    display:flex;
  }
  
`;


const IconContainer = styled.div`
  display:flex;
  align-items: center;
  gap: 1rem;

  svg {
    color: white;
    font-size: 1.5rem;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    
  
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    display:none;
  }
  
`;


const StyledBadge = muiStyled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 0,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));


const MenuButton = styled(IconButton)`
  font-size: 1.8rem;
  display:none;
  opacity:0;

  svg{
    
  }
  @media (max-width: 768px) {
    display: flex;
    visibility:visible;
    opacity:1;
  }
`;

const DropdownMenu = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: #282828;
  color: white;
  width: 100%;
  position: absolute;
  top:100px;
  left: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem 1rem;
  transition: all 0.4s ease-in-out;
  z-index: 999;

  .group {
    display:flex;
    align-items: center;
    position: relative;
    width: 100%;

    .input {
      font-family: "Montserrat", sans-serif;
      width: 100%;
      height: 40px;
      padding-left: 2.5rem;
      border: none;
      border-radius: 8px;
      background-color: #16171d;
      color: #bdbecb;
      transition: all 0.25s ease;

      &:hover {
        box-shadow: 0 0 0 2px #2f303d;
      }
      
      &:focus {
        box-shadow: 0 0 0 2px #2f303d;
      }
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      fill: #bdbecb;
      width: 1rem;
      height: 1rem;
      z-index: 1;
    }
  }

  @media (min-width: 769px) {
    display:none;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: static;
    box-shadow: none;
    padding: 0;
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    color: #ff5252;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;




const CartDropDown = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 450px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  transition: transform 0.5s ease-in-out;  /* Smooth transition */
  transform: ${({ $isCartOpen }) => ($isCartOpen ? 'translateX(0)' : 'translateX(100%)')};

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  background: #f9f9f9;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: scale(1.02);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  margin-left: 1rem;

  h4 {
    font-size: 1.2rem;
    color: #333;
    margin: 0;
  }

  p {
    font-size: 1rem;
    color: #666;
    margin: 0;
  }

  @media (max-width: 480px) {
    h4 {
      font-size: 1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    font-size: 1rem;
    font-weight: bold;
    color: #444;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const QuantityButton = styled.button`
  background: #212121;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #282828;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  padding: 1rem;
  border-top: 1px solid #eee;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CheckoutButton = styled.button`
  background: #212121;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  box-shadow: 0 4px 10px rgba(58, 59, 60, 0.4);

  &:hover {
    background: #282828;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const CartCloseButton = styled.button`
  background: transparent;
  color: #555;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  position: absolute;
  top:10px;
  right:5px;
  transition: color 0.3s;

  &:hover {
    color: #ff5252;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    top: 15px;
    right: 15px;
  }
`;


