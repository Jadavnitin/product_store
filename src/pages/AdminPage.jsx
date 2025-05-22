import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import imageCompression from 'browser-image-compression';
import TableOfProduct from '../components/TableOfProduct';
import { addProduct } from '../reducers/productSlice';
import { useDispatch } from 'react-redux';
import ProductNavbar from '../components/ProductNavbar';
import { searchFunctionality } from '../reducers/searchSlice';
import { Toaster,toast } from 'react-hot-toast';


const AdminPage = () => {
   const [userData, setUserData] = useState({
      id:"",
      addImage: '',
      title: '',
      description: '',
      price: '',
      brand: '',
      rating:''
   });


   const [errors, setErrors] = useState({});
   const dispatch = useDispatch();

   const [products, setProducts] = useState([]);
   const [showForm, setShowForm] = useState(false);
   const fileInputRef = useRef(null);

   

   const validateForm = () => {
      const newErrors = { ...errors };
      const positiveNumberRegex = /^(?!0+(?:\.0+)?$)\d*\.?\d+$/;


      if (!userData.title) {
         newErrors.title = "Title is required";
      }

      if (!userData.description) {
         newErrors.description = "Description is required";
      }

      if (!userData.brand) {
         newErrors.brand = "Category is required";
      }

      // if (positiveNumberRegex.test(userData.price)) {
      //    newErrors.price = "Price Contain Only Positive Number";
      // }
      // if (!userData.price) {
      //    newErrors.price = "Price is required";
      // }

      if (!userData.addImage) {
         newErrors.addImage = "Image is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };



   
   
   useEffect(() => {
      const savedImage = localStorage.getItem('productImage');
      if (savedImage) {
         setUserData((prev) => ({
            ...prev,
            addImage: savedImage,
         }));
      }
      
      
   }, []);

   const handlerChange = async (e) => {
      const { name, value, files } = e.target;

      
      if (name === "price") {
         const positiveNumberRegex = /^(?!0+(?:\.0+)?$)\d*\.?\d+$/;
         if (value === "" || positiveNumberRegex.test(value)) {
            setUserData({ ...userData, [name]: value });
         }
         return;
      }
      
      
      
 const newErrors = { ...errors };
      
      
  
       if (name === 'title') {
          if (!value) newErrors.title = "Title is required";
          else delete newErrors.title;
       }
       
       if (name === 'description') {
          if (!value) newErrors.description = "Description is required";
          else delete newErrors.description;
       }
  
       if (name === 'brand') {
          if (!value) newErrors.brand = "Category is required";
          else delete newErrors.brand;
       }
  
  
      //  if (name=== "price") {
      //     const positiveNumberRegex = /^(?!0+(?:\.0+)?$)\d*\.?\d+$/;
      //     if (!value) newErrors.price = "Price is required";
      //     else if (!positiveNumberRegex.test(value)) newErrors.price = "Price Contain Only Positive Number";
      //     else delete newErrors.price;
      // }
      
      if (name === 'addImage') {
         if (!value) newErrors.addImage = "Image is required";
         else delete newErrors.addImage;
      }
       
   
      setErrors(newErrors);
      
      
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
               const base64Image = reader.result;
               localStorage.setItem('productImage', base64Image);
               setUserData({ ...userData, addImage: base64Image });
            };
            reader.readAsDataURL(compressedFile);

         } catch (error) {
            console.error("Error compressing image:", error);
         }
      } else {
         setUserData({ ...userData, [name]: value });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      
      const payload = {
         id: crypto.randomUUID(),
         title: userData.title,
         description: userData.description,
         price: userData.price,
         brand: userData.brand,
         image: userData.addImage, 
         rating:5,
      };


      try {
         
         dispatch(addProduct(payload));
         toast.success('Product added successfully!');
         
         setUserData({ addImage: '', title: '', description: '', price: '', brand: '' });
         if (fileInputRef.current) fileInputRef.current.value = '';
         setShowForm(false);
      } catch (error) {
         console.error('Error adding product:', error);
         toast.error('Failed to add product.');
      }
   };

   const openForm = () => {
      setUserData({ ...userData, addImage: '' });
      setShowForm(true);
   };

    const hanlderSearch = (e) => {
         dispatch(searchFunctionality(e.target.value));
   }
   


 
   
   
   return (
      <>
         <Toaster position="top-right" reverseOrder={false}/>
         <ProductNavbar />
         <Container>
            <AddProductAndSearch>
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
               <AddProductButton onClick={openForm}>Add Product</AddProductButton>
            </AddProductAndSearch>
            {showForm && (
               <FormModal>
                  <Card>
                     <Title>Add New Product</Title>
                     <Form onSubmit={handleSubmit}>
                        <FormGroup $full>
                           <Label htmlFor="title">Title</Label>
                           <Input id="title" name="title" value={userData.title} onChange={handlerChange} />
                           <Error>{errors.title || " "}</Error>
                        </FormGroup>
                        <FormGroup $full>
                           <Label htmlFor="description">Description</Label>
                           <Textarea id="description" name="description" rows="4" value={userData.description} onChange={handlerChange} />
                           <Error>{errors.description || " "}</Error>
                        </FormGroup>
                        <FormGroup>
                           <Label htmlFor="price">Price</Label>
                           <Input id="price" name="price" type="number" value={userData.price} onChange={handlerChange} />
                           <Error>{errors.price || " "}</Error>
                        </FormGroup>
                        <FormGroup>
                           <Label htmlFor="category">Category</Label>
                           <Input id="category" name="brand" value={userData.brand} onChange={handlerChange} />
                           <Error>{errors.brand || " "}</Error>
                        </FormGroup>
                        <FormGroup $full>
                           <Label htmlFor="addImage">Product Image</Label>
                           <FileInput id="addImage" name="addImage" type="file" accept="image/*" onChange={handlerChange} ref={fileInputRef} />
                           <Error>{errors.addImage|| " "}</Error>
                        </FormGroup>
                        {userData.addImage && (
                           <FormGroup $full>
                              <Label>Image Preview</Label>
                              <ImagePreview src={userData.addImage} alt="Preview" />
                           </FormGroup>
                        )}
                        
                        <ButtonContainer>
                        <Button type="submit">Add Product</Button>
                           <Button type="button" onClick={() => {
                              setShowForm(false)
                              setUserData({})
                              setErrors({})
                           }}>Cancel</Button>
                        </ButtonContainer>
                        
                     </Form>
                  </Card>
               </FormModal>
            )}
         </Container>
         <TableOfProduct externalData={products} />
      </>
   );
};

export default AdminPage;


const Error = styled.span`
color: red;
font-size:1rem;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;


const Container = styled.div`
  padding: 1.5rem;
  padding-top: 9rem;
  background-color: #f3f4f6;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 6rem;
  }
`;

const AddProductAndSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 800px) {
    padding-top:3rem;
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  grid-column: 1 / -1;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
  width: 100%;

  .group {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    max-width: 580px;
  }

  .input {
    font-family: "Montserrat", sans-serif;
    width: 100%;
    height: 50px;
    padding-left: 2.5rem;
    border: none;
    border-radius: 12px;
    background-color: #16171d;
    color: #bdbecb;
    outline: none;
    box-shadow: 0 0 0 1.5px #2b2c37, 0 0 25px -17px #000;
    transition: all 0.25s ease;

    &:hover {
      box-shadow: 0 0 0 2.5px #2f303d, 0 0 25px -15px #000;
    }

    &:focus {
      box-shadow: 0 0 0 2.5px #2f303d;
    }

    @media (max-width: 480px) {
      height: 38px;
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
  }
`;

const AddProductButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #111;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FormModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const FileInput = styled.input``;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #111;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  grid-column: 1 / -1;

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const ImagePreview = styled.img`
  max-height: 100px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-top: 0.5rem;
  width: auto;
  max-width: 100%;
`;
