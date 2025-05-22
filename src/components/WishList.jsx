import React from 'react'
import { FaArrowLeft, FaCartPlus, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { removeWishListItem } from '../reducers/wishListSlice';
import { addToCart } from '../reducers/cartSlice';
import ProductNavbar from './ProductNavbar';
// import { ToastContainer } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const WishList = () => {


  const navigate = useNavigate();
  
  
  const dispatch = useDispatch();


  const wishListItems = useSelector((state) => state.wishList.wishListItems);

  const hanlderRemoveWishList = (id) => {
   
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeWishListItem(id));
        Swal.fire({
          title: "Deleted!",
          text: "Your Product has been removed.",
          icon: "success"
        });
      }
    });


  }



  const handlerAddToCart = (wishListItem) => {
    dispatch(addToCart(wishListItem));

  };



  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ProductNavbar />
      <WishlistContainer>
        <Header>
          <Back onClick={() => navigate("/")}>
            <FaArrowLeft size={18} />
            BACK
          </Back>
          <div>PRODUCT</div>
          <div>PRICE</div>
          <div>ACTION</div>
        </Header>

        {wishListItems.length > 0 ? (
          wishListItems.map(wishListitem => (
            <WishlistItem key={wishListitem.id}>
              <ItemInfo>
                <img src={wishListitem.thumbnail || wishListitem.image} alt={wishListitem.title} />
                <ItemDetails>
                  <h4>{wishListitem.title}</h4>
                  <p>Price: {wishListitem.price}</p>
                </ItemDetails>
              </ItemInfo>
              <Price>{wishListitem.price}</Price>
              <Actions>
                <button onClick={() => handlerAddToCart(wishListitem)}><FaCartPlus /> Add to Cart</button>
                <button onClick={() => hanlderRemoveWishList(wishListitem.id)}><FaTrashAlt /> Remove</button>
              </Actions>
            </WishlistItem>
          ))
        ) : (<EmptyWishListCartItemsContainer><EmptyWishListCartItems>Your WishList cart is empty!</EmptyWishListCartItems></EmptyWishListCartItemsContainer>)}


      </WishlistContainer>
    </>
  )
}

export default WishList

const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr;
  align-items: center;
  background: #282828;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 1rem;

  > div {
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.75rem;
    display: none;
  }
`;

const Back = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
   font-size: 1.1rem;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;


const EmptyWishListCartItems = styled.h1`
font-size:1.25rem;
font-weight: 900;
color: black;

`;

const EmptyWishListCartItemsContainer = styled.div`
display: flex;
height:80vh;
align-items: center;
justify-content:center;
`;

const WishlistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 7rem  2rem 2rem;
  background: #f5f5f5;
  min-height: 100vh;

`;



const WishlistItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;

    img {
      width: 100%;
      height: auto;
    }
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h4 {
    font-size: 1.2rem;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #555;
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

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;

  button {
    background: #282828;
    color: white;
    border: none;
    padding: 0.75rem 1.2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #444;
    }

    &:nth-child(2) {
      background: #ff5252;

      &:hover {
        background: #e53935;
      }
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;