import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminSignUp } from '../reducers/adminSlice';

const SignUpPage = () => {
   const [adminData, setAdminData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
   });

   const [errors, setErrors] = useState({});
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const admins = useSelector(state => state.admin.admin);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handlerSignIn = () => navigate("/adminsignin");

   const validateForm = () => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

      if (!adminData.email) {
         newErrors.email = "Email is required.";
      } else if (!emailRegex.test(adminData.email)) {
         newErrors.email = "Invalid email format.";
      } else if (admins.some(admin => admin.email === adminData.email)) {
         newErrors.email = "Admin already exists!";
      }

      if (!adminData.password) {
         newErrors.password = "Password is required.";
      } else if (!passwordRegex.test(adminData.password)) {
         newErrors.password = "Min. 6 chars, include letters & numbers.";
      }

      if (!adminData.confirmPassword) {
         newErrors.confirmPassword = "Confirm password is required.";
      } else if (adminData.password !== adminData.confirmPassword) {
         newErrors.confirmPassword = "Passwords do not match.";
         toast.error("Passwords do not match");
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handlerSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      dispatch(adminSignUp({
         email: adminData.email,
         password: adminData.password,
      }));

      toast.success("Admin Signup Successfully!");
      setTimeout(() => navigate("/adminsignin"), 1000);
   };

   const handlerChange = (e) => {
      const { name, value } = e.target;
      const updatedData = { ...adminData, [name]: value };
      setAdminData(updatedData);

      const newErrors = { ...errors };

      if (name === 'email') {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!value) newErrors.email = "Email is required.";
         else if (!emailRegex.test(value)) newErrors.email = "Invalid email format.";
         else if (admins.some(admin => admin.email === value)) newErrors.email = "Admin already exists!";
         else delete newErrors.email;
      }
   

      if (name === 'password') {
         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
         if (!value) newErrors.password = "Password is required.";
         else if (!passwordRegex.test(value)) newErrors.password = "Min. 6 chars, include letters & numbers.";
         else delete newErrors.password;
      }

      if (name === 'confirmPassword') {
         if (!value) newErrors.confirmPassword = "Confirm password is required.";
         else if (updatedData.password !== value) newErrors.confirmPassword = "Passwords do not match.";
         else delete newErrors.confirmPassword;
      }

      setErrors(newErrors);
   };

   return (
      <Wrapper>
         <ToastContainer position="top-right" autoClose={1000} />
         <div className="form-box">
            <form className="form" onSubmit={handlerSubmit}>
               <h1 className="title">Sign Up</h1>
               <span className="subtitle">Create a free account with your email.</span>

               <div className="form-container">
                  {/* Email */}
                  <div className="field">
                     <input
                        type="email"
                        placeholder="Email"
                        name='email'
                        onChange={handlerChange}
                        value={adminData.email}
                     />
                     <Error>{errors.email || " "}</Error>
                  </div>

                  {/* Password */}
                  <div className="field">
                     <div className="password-wrapper">
                        <input
                           type={showPassword ? "text" : "password"}
                           placeholder="Password"
                           name='password'
                           onChange={handlerChange}
                           value={adminData.password}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                           {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                     </div>
                     <Error>{errors.password || " "}</Error>
                  </div>

                  {/* Confirm Password */}
                  <div className="field">
                     <div className="password-wrapper">
                        <input
                           type={showConfirmPassword ? "text" : "password"}
                           placeholder="Confirm Password"
                           name='confirmPassword'
                           onChange={handlerChange}
                           value={adminData.confirmPassword}
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                           {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                     </div>
                     <Error>{errors.confirmPassword || " "}</Error>
                  </div>
               </div>

               <button type="submit">Sign Up</button>
            </form>

            <div className="form-footer">
               <p>Have an account? <span onClick={handlerSignIn}>Sign In</span></p>
            </div>
         </div>
      </Wrapper>
   );
};

export default SignUpPage;

// Styled Components
const Wrapper = styled.div`
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f7fe;

  .form-box {
    background: white;
    padding: 30px;
    max-width: 600px;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
  }

  .subtitle {
    font-size: 1rem;
    text-align: center;
    color: #555;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap:0.2rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-height:70px;
  }

  input {
    width: 100%;
    padding: 12px 15px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: #0066ff;
    outline: none;
  }

  .password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .password-wrapper input {
    width: 100%;
  }

  .password-wrapper span {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #888;
  }

  button {
    padding: 12px;
    background-color: #0066ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
  }

  button:hover {
    background-color: #0052cc;
  }

  .form-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9rem;
  }

  .form-footer span {
    font-weight: bold;
    color: #0066ff;
    cursor: pointer;
  }
`;

const Error = styled.span`
  color: red;
  font-size: 0.8rem;
  height: 16px;
  margin-top: 2px;
`;




