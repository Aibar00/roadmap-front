import { useState } from 'react'
import './Login.css'
import loginPageImage from './loginPageImage.png'
import Header from '../header/Header';

function Login() {
    return (
        <div className='loginPage'>
            <Header></Header>
            <img src={loginPageImage} className='regBackgroundImage' alt="Vite logo" />
            <div className="right-half-rectangle">
                <div className="loginContainer">
                    <div className='textRoadMap'>ROADMAP</div>
                    <div className='textWelcome'>Welcome to our website!</div>
                    <div className='loginInput'>
                        <input type="text" placeholder="Username or Email" />
                    </div>
                    <div className='loginInput'>
                    <   input type="password" placeholder="Password" />
                    </div>
                    <div className="forgotPassword">
                        <a href="" className="forgotPasswordLink">Forgot your password?</a>
                    </div>
                    <div>
                        <button className='loginButton'>Login</button>
                    </div>
                    <div className="signupText">
                        Don't have an account? <a href="/signup" className="signupLink">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}    

export default Login;
