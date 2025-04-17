import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/profileSlice';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.profile.users);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handlerSignUp = () => {
    navigate("/signup");
  };

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlerSubmit = (e) => {
    e.preventDefault();

   
    const user = users.find((u) => u.email === userData.email && u.password === userData.password);

    if (user) {
      dispatch(login(userData));
      
      toast.success("Sign in Successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <Wrapper>
        <div className="form-box">
          <form className="form" onSubmit={handlerSubmit}>
            <h1 className="title">Sign In</h1>
            <span className="subtitle">Welcome back! Please login to your account.</span>

            <div className="form-container">
              <div className="field">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={userData.email}
                  onChange={handlerChange}
                />
              </div>

              <div className="field password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={userData.password}
                  onChange={handlerChange}
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit">Sign In</button>
          </form>

          <div className="form-footer">
            <p>Don't have an account? <span onClick={handlerSignUp}>Sign Up</span></p>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default SignInPage;

// Styled components
const Wrapper = styled.div`
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f7fe;

  .form-box {
    background: white;
    padding: 30px;
    max-width: 500px;
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
    gap: 1rem;
    margin-top: 1rem;
  }

  .field {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  input {
    padding: 10px 15px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
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

  .form-footer span:hover {
    text-decoration: underline;
  }
`;
