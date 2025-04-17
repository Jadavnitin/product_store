import React from "react";
import styled from "styled-components";

const CheckoutPage = () => {
  return (
    <CheckoutWrapper>
      <h1> Secure Checkout 🛒 </h1>
      
      <CheckoutContainer>
         <Title>Checkout</Title>

         <Section>
            <Label>Full Name</Label>
            <Input type="text" placeholder="Enter your name" />
         </Section>

         <Section>
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" />
         </Section>

         <Section>
            <Label>Address</Label>
            <Input type="text" placeholder="Enter your address" />
         </Section>

         <Section>
            <Label>Payment Method</Label>
            <Select>
               <option value="credit_card">Credit Card</option>
               <option value="paypal">PayPal</option>
               <option value="bank_transfer">Bank Transfer</option>
            </Select>
         </Section>

         <Button>Place Order</Button>
      </CheckoutContainer>
    </CheckoutWrapper>
   );
};

export default CheckoutPage;

const CheckoutWrapper = styled.div`
height:100vh;
width:100%;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
 gap:2.5rem;

 h1{
   font-size:4rem;
   font-weight:900;
   font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
`;

const CheckoutContainer = styled.div`
  max-width: 500px;
  width:100%;
  padding: 20px;
  border: 2px solid #fff;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  background-color: #000;
  color: #fff;

  @media (max-width: 600px) {
    width: 90%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: #222;
  color: #fff;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: #222;
  color: #fff;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: 0.3s;
  &:hover {
    background-color: #444;
    color: #fff;
  }
`;
