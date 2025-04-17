import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '../reducers/cartSlice';
import { useDispatch } from 'react-redux';
import ProductNavbar from './ProductNavbar';

const ProductCardDetails = () => {
  const { id } = useParams();
  const [singleProductData, setSingleProductData] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); 
    axios.get(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        setSingleProductData(res.data);
        setMainImage(res.data.thumbnail || null);
        setLoading(false); 
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); 
        
      });
  }, [id]);

  const handlerAddToCart = (singleProduct) => {
    dispatch(addToCart(singleProduct));
  };

  const hanlderBackTohome = () => {
    navigate("/");
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <>
      <ProductNavbar />
      <PageContainer>
        {loading ? (
          <LoaderContainer> 
            <Loader />
          </LoaderContainer>
        ) : (
          <ProductCard>
            <ImageSection>
              <MainImageContainer>
                {mainImage && (<ProductImage src={mainImage} alt={singleProductData.title} />)}
              </MainImageContainer>
            </ImageSection>

            <DetailsSection>
              <Title>{singleProductData.title}</Title>
              <Description>{singleProductData.description}</Description>

              <PriceSection>
                <Price>${singleProductData.price}</Price>
                <OldPrice>${(singleProductData.price * 2)}</OldPrice>
                <Discount>20% OFF</Discount>
              </PriceSection>

              <ThumbnailContainer>
                {singleProductData.images?.map((image, index) => (
                  <Thumbnail
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index}`}
                    onClick={() => handleThumbnailClick(image)}
                    $isactive={mainImage === image}
                  />
                ))}
              </ThumbnailContainer>

              <ButtonContainer>
                <AddToCartButton onClick={() => handlerAddToCart(singleProductData)}>
                  <FaShoppingCart /> Add to Cart
                </AddToCartButton>
                <BuyNowButton onClick={hanlderBackTohome}>
                  <FaArrowLeft /> Back
                </BuyNowButton>
              </ButtonContainer>
            </DetailsSection>
          </ProductCard>
        )}
      </PageContainer>
    </>
  );
};

export default ProductCardDetails;


const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #e91e63;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;



const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height:100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 115px 20px 20px;

 
  @media (max-width: 400px) {
    padding:115px 5px 5px;
  }
`;

const ProductCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1400px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }
   @media (max-width: 400px) {
     width:99.5%;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

const MainImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const ProductImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  transition: transform 0.4s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    max-height: 350px;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-self: flex-start;
  gap:1rem;
  flex-wrap: wrap;
`;

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 2px solid ${({ $isactive }) => ($isactive ? '#212121' : '#ccc')};
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const DetailsSection = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  gap:1rem;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  font-size: 38px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #555;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Price = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #e91e63;
`;

const OldPrice = styled.span`
  font-size: 24px;
  color: #757575;
  text-decoration: line-through;
`;

const Discount = styled.span`
  font-size: 18px;
  color: #292929;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #212121;
  color: white;
  border: none;
  padding: 15px 35px;
  font-size: 18px;
  border-radius: 8px;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #282828;
    transform: scale(1.05);
  }

  svg {
    font-size: 22px;
  }
`;

const BuyNowButton = styled.button`
  background: #212121;
  color: white;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 15px 35px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #282828;
    transform: scale(1.05);
  }
`;

