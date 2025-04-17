import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { updateProfile } from "../reducers/profileSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";


const MyProfile = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const currentUser = useSelector((state) => state.profile.currentUser);

   const [profileData, setProfileData] = useState({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      address: currentUser?.address || "",
      email: currentUser?.email || "",
      profileImage: currentUser?.profileImage || "",
   });

   const [isUpdated, setIsUpdated] = useState(false);

   const handleChange = (e) => {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
   };

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setProfileData({ ...profileData, profileImage: reader.result });
         };
         reader.readAsDataURL(file);
      }
   };

   const removeImage = () => {
      setProfileData({ ...profileData, profileImage: "" });
   };

   const handleUpdate = () => {
      dispatch(updateProfile(profileData));
      setIsUpdated(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
         navigate("/");
      }, 1500);
   };

   return (
      <>
         <ToastContainer autoClose={1000} />
         <Container>
            <Header>
               <Back onClick={() => navigate("/")}>
                  <FaArrowLeft size={18} />
                  Home
               </Back>
               <Title>My Profile</Title>
            </Header>

            <Card>
               <ImageSection>
                  <label htmlFor="upload" className="upload-area">
                     {profileData.profileImage ? (
                        <div className="preview">
                           <img src={profileData.profileImage} alt="Profile" />
                           <button onClick={removeImage} className="remove">
                              <FaTrash size={14} />
                           </button>
                        </div>
                     ) : (
                        <div className="upload">
                           <FaPlus size={22} />
                        </div>
                     )}
                     <div className="text-below">Change Profile Photo</div>
                  </label>

                  <input
                     type="file"
                     id="upload"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </ImageSection>

               <Form>
                  <Input
                     name="firstName"
                     placeholder="First Name"
                     value={profileData.firstName}
                     onChange={handleChange}
                  />
                  <Input
                     name="lastName"
                     placeholder="Last Name"
                     value={profileData.lastName}
                     onChange={handleChange}
                  />
                  <Input
                     name="address"
                     placeholder="Address"
                     value={profileData.address}
                     onChange={handleChange}
                  />
                  <Input
                     name="email"
                     type="email"
                     placeholder="Email"
                     value={profileData.email}
                     onChange={handleChange}
                  />
                  <Button onClick={handleUpdate} disabled={isUpdated}>
                     {isUpdated ? "Updated" : "Save Changes"}
                  </Button>
               </Form>
            </Card>
         </Container>
      </>
   );
};

export default MyProfile;



const Container = styled.div`
   min-height: 100vh;
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 2rem;
   background: white;
`;

const Header = styled.div`
   width: 100%;
   max-width: 600px;
   position: relative;
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-bottom: 2rem;
`;

const Title = styled.h1`
   position: absolute;
   left: 50%;
   transform: translateX(-50%);
   font-size: 2.2rem;
   font-weight: 700;
   color: black;
   font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Back = styled.button`
   display: flex;
   align-items: center;
   gap: 6px;
   background: transparent;
   color: #212121;
   border: none;
   cursor: pointer;
   font-size: 1rem;

   &:hover {
      color: #292929;
      text-decoration: underline;
   }
`;

const Card = styled.div`
   background: #1e1e1e;
   max-width: 600px;
   width: 100%;
   padding: 2rem;
   border-radius: 12px;
   box-shadow: 0 6px 16px rgba(255, 255, 255, 0.05);
`;

const ImageSection = styled.div`
   text-align: center;
   margin-bottom: 1rem;

   input {
      display: none;
   }

   .upload-area {
      cursor: pointer;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
   }

   .upload,
   .preview {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #999;
      background: #2a2a2a;
      color: #ccc;
      font-size: 2rem;
      position: relative;
      margin-bottom: 0.5rem;
   }

   .upload:hover {
      background: #333;
   }

   .preview img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #fff;
   }

   .remove {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 50%;
      padding: 6px;
      cursor: pointer;
   }

   .text-below {
      font-size: 0.9rem;
      color: #aaa;
      margin-top: 0.5rem;
      cursor: pointer;
   }
`;

const Form = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
`;

const Input = styled.input`
   padding: 12px;
   border: 1px solid #444;
   border-radius: 8px;
   font-size: 1rem;
   background: #1c1c1c;
   color: #fff;

   &:focus {
      outline: none;
      border-color: #888;
      background: #222;
   }

   &::placeholder {
      color: #777;
   }
`;

const Button = styled.button`
   padding: 12px;
   background: #212121;
   color: white;
   font-weight: bold;
   border: none;
   border-radius: 8px;
   font-size: 1rem;
   cursor: pointer;
   transition: background 0.2s;

   &:hover {
      background: #292929;
   }

   &:disabled {
      background: #444;
      cursor: not-allowed;
   }
`;
