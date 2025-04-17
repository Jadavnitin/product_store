import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../reducers/profileSlice';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    image: "",
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const users = useSelector(state => state.profile.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlerSignIn = () => {
    navigate("/signin");
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!nameRegex.test(userData.firstName)) {
      newErrors.firstName = "First name must contain only letters.";
    }

    if (!nameRegex.test(userData.lastName)) {
      newErrors.lastName = "Last name must contain only letters.";
    }

    if (!userData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!emailRegex.test(userData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (users.some(user => user.email === userData.email)) {
      toast.error("User already exists!");
    }

    if (!passwordRegex.test(userData.password)) {
      newErrors.password = "Min. 6 chars, include letters & numbers.";
    }

    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match!");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(signUp({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      profileImage: userData.image
    }));

    toast.success("Sign Up Successfully..");

    setTimeout(() => {
      navigate("/signin");
    }, 1000)
  };

  const handlerChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  return (
    <Wrapper>
      <ToastContainer position="top-right" autoClose={1000} />
      <div className="form-box">
        <form className="form" onSubmit={handlerSubmit}>
          <h1 className="title">Sign Up</h1>
          <span className="subtitle">Create a free account with your email.</span>

          <div className="form-container">
            <div className="fullName">
              <div className="field">
                <input
                  type="text"
                  placeholder="First Name"
                  name='firstName'
                  onChange={handlerChange}
                  value={userData.firstName}
                />
                {errors.firstName && <Error>{errors.firstName}</Error>}
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Last Name"
                  name='lastName'
                  onChange={handlerChange}
                  value={userData.lastName}
                />
                {errors.lastName && <Error>{errors.lastName}</Error>}
              </div>
            </div>

            <div className="field">
              <input
                type="text"
                placeholder="Address"
                name='address'
                onChange={handlerChange}
                value={userData.address}
              />
              {errors.address && <Error>{errors.address}</Error>}
            </div>

            <div className="field">
              <input
                type="email"
                placeholder="Email"
                name='email'
                onChange={handlerChange}
                value={userData.email}
              />
              {errors.email && <Error>{errors.email}</Error>}
            </div>

            <div className="field password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name='password'
                onChange={handlerChange}
                value={userData.password}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && <Error>{errors.password}</Error>}
            </div>

            <div className="field password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name='confirmPassword'
                onChange={handlerChange}
                value={userData.confirmPassword}
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && <Error>{errors.confirmPassword}</Error>}
            </div>

            <div className="field">
              <input
                type="file"
                accept="image/*"
                name='image'
                onChange={handlerChange}
              />
              {userData.image && (
                <ImagePreview src={userData.image} alt="Preview" />
              )}
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
    gap: 1.5rem; 
  }

  .fullName {
    display: flex;
    gap: 20px;
    justify-content: space-between;
  }

  .field {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  input {
    padding: 12px 15px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-bottom: 5px;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }

  input:focus {
    border-color: #0066ff;
    outline: none;
  }

  .password-field {
    position: relative;
  }

  .password-field span {
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
  margin-top: 0.3rem;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
  align-self: center;
  border: 2px solid #ccc;
`;
