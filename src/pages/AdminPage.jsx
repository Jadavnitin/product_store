import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import imageCompression from 'browser-image-compression';
import TableOfProduct from '../components/TableOfProduct';



const AdminPage = () => {
   const [userData, setUserData] = useState({
      addImage: '',
      title: '',
      description: '',
      price: '',
      category: '',
   });

   const fileInputRef = useRef(null);

  

   const handlerChange = async (e) => {
      const { name, value, files } = e.target;

      if (files && files.length > 0) {
         const file = files[0];

        
         const options = {
            maxSizeMB: 1, 
            maxWidthOrHeight: 1024, 
            useWebWorker: true,
         };

         try {
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();

            reader.onloadend = () => {
               setUserData({ ...userData, addImage: reader.result });
            };

            reader.readAsDataURL(compressedFile);
         } catch (error) {
            toast.error('Failed to compress image');
            console.error(error);
         }
      } else {
         setUserData({ ...userData, [name]: value });
      }
   };



   const handleSubmit = async (e) => {
      e.preventDefault();

      const payload = {
         
         title: userData.title,
         description: userData.description,
         price:userData.price,
         category: userData.category,
         images: [userData.addImage], 
      };

      try {
         const response = await axios.post('https://dummyjson.com/products/add', payload, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         console.log('Product added:', response.data);
         toast.success('Product added successfully!');

         setUserData({
            addImage: '',
            title: '',
            description: '',
            price: '',
            category: '',
         });

         if (fileInputRef.current) {
            fileInputRef.current.value = '';
         }
      } catch (error) {
         console.error('Error adding product:', error);
         toast.error('Failed to add product.');
      }
   };

   return (
      <>
      <Container>
         <ToastContainer autoClose={1000} />
         <Card>
            <Title>Add New Product</Title>
            <Form onSubmit={handleSubmit}>
               <FormGroup $full>
                  <Label htmlFor="title">Title</Label>
                  <Input
                     id="title"
                     name="title"
                     placeholder="Enter product title"
                     required
                     onChange={handlerChange}
                     value={userData.title}
                  />
               </FormGroup>

               <FormGroup $full>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                     id="description"
                     name="description"
                     rows="4"
                     placeholder="Enter product description"
                     required
                     onChange={handlerChange}
                     value={userData.description}
                  />
               </FormGroup>

               <FormGroup>
                  <Label htmlFor="price">Price</Label>
                  <Input
                     id="price"
                     name="price"
                     type="number"
                     placeholder="0.00"
                     min="0"
                     step="0.01"
                     required
                     onChange={handlerChange}
                     value={userData.price}
                  />
               </FormGroup>

               <FormGroup>
                  <Label htmlFor="category">Category</Label>
                  <Input
                     id="category"
                     name="category"
                     placeholder="e.g. Electronics"
                     required
                     onChange={handlerChange}
                     value={userData.category}
                  />
               </FormGroup>

               <FormGroup $full>
                  <Label htmlFor="addImage">Product Image</Label>
                  <FileInput
                     id="addImage"
                     name="addImage"
                     type="file"
                     accept="image/*"
                     onChange={handlerChange}
                     ref={fileInputRef}
                     required
                  />
               </FormGroup>

               {userData.addImage && (
                  <FormGroup $full>
                     <Label>Image Preview</Label>
                     <ImagePreview src={userData.addImage} alt="Preview" />
                  </FormGroup>
               )}

               <Button type="submit">Add Product</Button>
            </Form>
         </Card>
       
      </Container>
        <TableOfProduct/>
        
      </>
   );
};

export default AdminPage;



const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  overflow-x: hidden;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FileInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #282828;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: black;
  }

  grid-column: 1 / -1;
  justify-self: end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height:100px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;
