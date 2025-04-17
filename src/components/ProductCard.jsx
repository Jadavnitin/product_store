import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaCheck, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from "../reducers/cartSlice";
import { addWishListCart } from '../reducers/wishListSlice';
import { filterCategory, selectedFilterCategory } from '../reducers/categorySlice';
import { AscendingOrder, DecendingOrder, DefaultOrder } from '../reducers/filterSlice';
import { FaChevronDown } from "react-icons/fa";
import Badge from '@mui/material/Badge';
import { IconButton } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import CustomPagination from './CustomPagination';
import { searchFunctionality } from '../reducers/searchSlice';


const ProductCard = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);


   const searchWord = useSelector((state) => state.search.searchWord || "");
   const wishListItems = useSelector((state) => state.wishList.wishListItems);
   const ascdingOrder = useSelector((state) => state.filterPrice.productAscOrder);
   const decendingOrder = useSelector((state) => state.filterPrice.productDscOrder);
   const defaultProducts = useSelector((state) => state.filterPrice.defaultProducts);
   const selectedCategory = useSelector((state) => state.category.selectedCategory);
   const categories = useSelector((state) => state.category.category);
   const currentUser = useSelector((state) => state.profile.currentUser);
   
   const email = currentUser?.email || "guest";
   
   let totalFilterApply = useSelector((state) => state.filterPrice.totalApplyFilter);
  
   const [selectedFilter, setSelectedFilter] = useState(null);
   const [page, setPage] = useState(1);

   const [totalProducts, setTotalProducts] = useState(0);

 
   
   
   const productData = selectedFilter === "lowToHigh" ? ascdingOrder
      : selectedFilter === "highToLow" ? decendingOrder
         : defaultProducts;


   const hanlderCategorySelect = (category) => {
      setLoading(true);
      if (selectedCategory?.name === category?.name) {
         dispatch(selectedFilterCategory(null));
         dispatch(DefaultOrder(defaultProducts));
      } else {
         dispatch(selectedFilterCategory(category));
      }
      setTimeout(() => {
         setLoading(false);
      }, 1000);
      setPage(1);
   };



   const handlerCard = (id) => {
      navigate(`/productdetails/${id}`);
   };


   const handlerAddToCart = (product) => {
      dispatch(addToCart({ ...product, email }));
   };

   const handlerWishListToCart = (product) => {
      dispatch(addWishListCart({ ...product, email }));
   };

   const isProductWishList = (id) => {
      return wishListItems.find((item) => item.id === id && item.isWishListActive);
   };



   const filterProductData = productData.filter((product) => {

      const matchesSearch = product?.title?.toLowerCase().includes(searchWord?.toLowerCase());

      return matchesSearch;
   });


   const totalPages = Math.ceil(totalProducts / 4);

   const limit = 4;
   const skip = (page - 1) * limit;

   useEffect(() => {
      const fetchProducts = async () => {
         setLoading(true);
         try {
            let url = "";
            const categoryName = selectedCategory?.name;

            if (categoryName) {
               const categorySlug = categoryName.toLowerCase().replace(/\s/g, "-");
               url = `https://dummyjson.com/products/category/${categorySlug}?limit=${limit}&skip=${skip}`;
            } else {
               url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
            }

            const res = await axios.get(url);
            let products = res.data.products;

            if (selectedFilter === "lowToHigh") {
               handlerFilterPriceLowToHigh();
            } else if (selectedFilter === "highToLow") {
               handlerFilterPriceHighToLow();
            }


            dispatch(DefaultOrder(products));
            setTotalProducts(res.data.total);
         } catch (error) {
            console.error("Error fetching products:", error);
         }
         setLoading(false);
      };

      fetchProducts();


      axios
         .get("https://dummyjson.com/products/categories")
         .then((res) => dispatch(filterCategory(res.data)))
         .catch((error) => console.error("Error fetching categories:", error));
   }, [dispatch, page, selectedFilter, selectedCategory]);




   const handlerFilterPriceLowToHigh = () => {
      setLoading(true);
      axios
         .get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}&sortBy=price&order=asc`)
         .then((res) => {
            dispatch(AscendingOrder(res.data.products));
            setLoading(false);
         })
         .catch((error) => {
            console.error("Error fetching sorted data:", error);
            setLoading(false);
         });
   };

   const handlerFilterPriceHighToLow = () => {
      setLoading(true);
      axios
         .get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}&sortBy=price&order=desc`)
         .then((res) => {
            dispatch(DecendingOrder(res.data.products));
            setLoading(false);
         })
         .catch((error) => {
            console.error("Error fetching sorted data:", error);
            setLoading(false);
         });
   };



   const toggleFilter = (filter) => {
      if (selectedFilter === filter) {
         setSelectedFilter(null);
      } else {
         setSelectedFilter(filter);
      }
      setPage(1);
   };

   const hanlderSearch = (e) => {
      dispatch(searchFunctionality(e.target.value));
   }
   
   return (



      <MainCardContaier>
       <SidebarContainer>
            <SearchContainer>
             <div className="group" >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
                          <g>
                            <path
                              d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
                            ></path>
                          </g>
                        </svg>
            
                        <input
                          id="query"
                          className="input"
                          type="search"
                          placeholder="Search..."
                         name="searchbar"
                        onChange={hanlderSearch}
                        />
            </div>
            </SearchContainer>
            
            <CategoryAndFilter>
            <IconButton aria-label="">
               <StyledBadge badgeContent={totalFilterApply} color="secondary">
                  <FilterContainer>
                     <FilterTitle>
                        Filter by <FaChevronDown className='icons' />
                     </FilterTitle>
                     <FilterDropdown>
                        <FilterDropdownItem
                           onClick={() => toggleFilter("lowToHigh")}
                           style={{ background: selectedFilter === "lowToHigh" ? "#ddd" : "transparent", color: selectedFilter === "lowToHigh" ? "black" : "#ddd" }}
                        >
                           {selectedFilter === "lowToHigh" && <FaCheck />} Price: Low to High
                        </FilterDropdownItem>

                        <FilterDropdownItem
                           onClick={() => toggleFilter("highToLow")}
                           style={{ background: selectedFilter === "highToLow" ? "#ddd" : "transparent", color: selectedFilter === "highToLow" ? "black" : "#ddd" }}
                        >
                           {selectedFilter === "highToLow" && <FaCheck />} Price: High to Low
                        </FilterDropdownItem>
                     </FilterDropdown>
                  </FilterContainer>
               </StyledBadge>
            </IconButton>



            <CategoryContainer>

               <CategoryTitle>
                  {selectedCategory?.name || "Category"} <FaChevronDown className='icons' />
               </CategoryTitle>


               <CategoryDropdown>

                  <CategoryDropdownItem onClick={() => hanlderCategorySelect(null)}>
                     Clear Category
                  </CategoryDropdownItem>

                  {categories?.map((categorieItem, index) => (
                     <CategoryDropdownItem
                        key={index}
                        onClick={() => hanlderCategorySelect(categorieItem)}
                        style={{
                           background: selectedCategory?.name === categorieItem.name ? "#ddd" : "transparent",
                           color: selectedCategory?.name === categorieItem.name ? "black" : "#ddd",
                        }}
                     >
                        {categorieItem.name}
                     </CategoryDropdownItem>
                  ))}
               </CategoryDropdown>
               </CategoryContainer>
            </CategoryAndFilter>
            
         </SidebarContainer>

         <CardContainer>
            {loading ? (
               <LoaderContainer>
                  <Loader />
               </LoaderContainer>

            ) : filterProductData.length === 0 ? (
               <h1>No Products Found</h1>
            ) : (
               filterProductData.map((product) => {

                  const isWishListActive = isProductWishList(product.id);


                  return (
                     <Card key={product.id}>
                        <div className="image-container" onClick={() => handlerCard(product.id)}>
                           <img src={product.thumbnail} alt={product.title} />
                        </div>

                        <div className="content">
                           <h2>{product.title}</h2>

                           <div className='ratings-container'>
                              <RatingContainer>
                                 {[5, 4, 3, 2, 1].map((value) => {
                                    const uniqueId = uuidv4();
                                    return (
                                       <div key={value}>
                                          <RatingInput
                                             type="radio"
                                             id={`star-${value}-${product.id}-${uniqueId}`}
                                             name={`rating-${product.id}`}
                                             value={value}
                                          />
                                          <RatingLabel htmlFor={`star-${value}-${product.id}-${uniqueId}`} />
                                       </div>
                                    );
                                 })}
                              </RatingContainer>
                           </div>

                           <div className="info">
                              <span><b>${product.price}</b></span>
                              <span>{product.brand}</span>
                           </div>

                           <div className="actions">
                              <button type="button" className="addtocart" onClick={() => handlerAddToCart(product)}>
                                 <FaShoppingCart />Add to Cart
                              </button>

                              <HeartButton
                                 $isWishListActive={isWishListActive}  // Apply click effect
                                 onClick={() => handlerWishListToCart(product)}>
                                 <FaRegHeart />
                              </HeartButton>
                           </div>
                        </div>

                        <NavLink to={`/productdetails/${product.id}`} />
                     </Card>
                  );
               })
            )}
         </CardContainer>

         <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
         />

      </MainCardContaier>
   );
};

export default ProductCard;


const CategoryAndFilter = styled.div`
display: flex;
justify-content:center;
align-items: center;
gap:1rem;

 @media (max-width: 580px) {
      width: 100%;
      flex-direction: column;

    }
`;



const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;


  .group {
    display: flex;
    align-items: center;
    position: relative;
    width:580px;

    @media (max-width: 1024px) {
      width:400px;
    }

    @media (max-width: 768px) {
     width: 100%;
    }

    @media (max-width: 480px) {
      width: 100%;
      gap: 0.5rem;
    }
  }

  .input {
    font-family: "Montserrat", sans-serif;
    width: 100%;
    height:50px;
    padding-left: 2.5rem;
    box-shadow: 0 0 0 1.5px #2b2c37, 0 0 25px -17px #000;
    border: 0;
    border-radius: 12px;
    background-color: #16171d;
    outline: none;
    color: #bdbecb;
    transition: all 0.25s ease;
    
    &:hover {
      box-shadow: 0 0 0 2.5px #2f303d, 0px 0px 25px -15px #000;
    }

    &:focus {
      box-shadow: 0 0 0 2.5px #2f303d;
    }

    @media (max-width: 480px) {
      height: 35px;
      font-size: 0.9rem;
    }
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    fill: #bdbecb;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    z-index: 1;
  }
`;


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height:50vh;
`;


const StyledBadge = muiStyled(Badge)(({ theme }) => ({
   '& .MuiBadge-badge': {
      right: 0,
      top: 0,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
   },
}));


const spin = keyframes`
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
`;


const Loader = styled.div`
   border: 4px solid #f3f3f3;
   border-top: 4px solid #000000;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   animation: ${spin} 1s linear infinite;
   margin: auto;
`;

const MainCardContaier = styled.div`
display: flex;
flex-direction: column;
background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
width: 100%;
padding: 2rem;
padding-top:8rem;
gap:2rem;
min-height: calc(100vh - 100px);
`;

const CardContainer = styled.div`
   display: grid;
   grid-template-columns: repeat(4,  1fr);
   gap:1rem;
   min-height: calc(100vh - 100px);
   width:100%;
   
   @media (max-width:1024px) {
       grid-template-columns: repeat(3,  1fr);
   }
   
     @media (max-width:960px) {
       grid-template-columns: repeat(2,  1fr);
   }
    
     @media (max-width:650px) {
       grid-template-columns: repeat(1,  1fr);
   }
   
`;

const SidebarContainer = styled.div`
display: flex;
justify-content:space-between;
gap:2rem;
align-items: center;
width:100%;

@media (max-width:970px){
   flex-direction: column;
   gap:1rem;
}
`;


const FilterContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: Arial, sans-serif;
`;

const FilterTitle = styled.div`
   color:white;
  position: relative;
  font-size: 1.2rem;
  cursor: pointer;
  padding:20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  width:200px;
  align-items: center;
  justify-content: space-between;
  background: #222;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

const FilterDropdown = styled.div`
  position: absolute;
  top:74px;
  left: 0;
  width:100%;
  background: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  transform: translateY(5px);
  overflow: hidden;

  ${FilterContainer}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const FilterDropdownItem = styled.div`
  padding: 12px 15px;
  font-size: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap:0.35rem;
  color: white;

  &:hover {
    background: #333;
    color: #fff;
  }
`;




const CategoryContainer = styled.div`
  display: inline-block;
  position: relative;
  font-family: Arial, sans-serif;
`;




const CategoryTitle = styled.div`
  color:white;
  position: relative;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 15px 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  width:265px;
  align-items: center;
  justify-content: space-between;
  background: #222;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: #000;
    color: #fff;
  }



`;



const CategoryDropdown = styled.div`
  position: absolute;
  top:60px;
  left: 0;
  width:100%;
  max-height:400px;
 background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  overflow-y: scroll;
  overscroll-behavior: contain; 

  ${CategoryContainer}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(10px);
  }

  
   &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;   
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #333, #555); 
    border-radius: 10px;
    transition: 0.3s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #888;    
  }

  scrollbar-width: thin;
  scrollbar-color: #555 #1e1e1e;
  

`;



const CategoryDropdownItem = styled.div`
  padding: 12px 15px;
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;
  cursor: pointer;

   &:hover {
    background: #333;
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
`;





const Card = styled.div`
   background: #fff;
   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
   border-radius: 12px;
   transition: transform 0.3s, box-shadow 0.3s;
   cursor: pointer;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   max-width: 380px;
   width: 100%;
   min-height: 500px;

   &:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
   }

   .image-container {
      height: 55%;
      width: 100%;
      overflow: hidden;

      img {
         width:100%;
         height:100%;
         object-fit: cover;
         transition: transform 0.5s ease;

         &:hover {
            transform: scale(1.1);
         }
      }
   }

   .content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 45%;
   }

   h2 {
      font-size: 1.45rem;
      color: #333;
   }

   .info {
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      color: #555;
      margin: 0.5rem 0;
   }

   .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }

   .addtocart {
      width: 75%;
      padding: 0.75rem 1rem;
      background: #212121;
      color: #fff;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.3s, transform 0.3s;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover {
         background: #222222;
         transform: scale(1.05);
      }

      svg {
         font-size: 1.2rem;
      }
   }
`;

const HeartButton = styled.button`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 45px;
   height: 45px;
   border-radius: 50%;
   background: ${({ $isWishListActive }) => ($isWishListActive ? '#ff2d2d' : '#ff9b9b')};
   color: white;
   border: none;
   cursor: pointer;
   transform: scale(${({ $isWishListActive }) => ($isWishListActive ? '1.1' : '1')});
   transition: transform 0.3s, background 0.3s;

   svg {
      font-size: 1.5rem;
   }

   &:hover {
      transform: scale(1.1);
      background: #ff2d2d;
   }
`;


const RatingContainer = styled.div`
  display: inline-flex;
`;

const RatingInput = styled.input`
  display: none;
`;

const RatingLabel = styled.label`
  cursor: pointer;
  font-size: 30px;
  color: #ccc;

  &:before {
    content: "★";
  }

  &:hover,
  &:hover ~ label,
  input:checked ~ label {
    color: #ffc300;
  }
`;
