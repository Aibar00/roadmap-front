import { useState } from 'react'
import './Login.css'
import loginPageImage from './loginPageImage.png'

function SignUp() {
    return (
        <div className='loginPage'>
            <img src={loginPageImage} className='regBackgroundImage' alt="Vite logo" />
            <div className="right-half-rectangle">
                <div className="loginContainer">
                    <div className='textRoadMap'>ROADMAP</div>
                    <div className='textWelcome'>Create your account!</div>
                    <div className='loginInput'>
                        <input type="text" placeholder="Username" />
                    </div>
                    <div className='loginInput'>
                        <input type="email" placeholder="Email" />
                    </div>
                    <div className='loginInput'>
                        <input type="password" placeholder="Password" />
                    </div>
                    <div className='loginInput'>
                        <input type="password" placeholder="Confirm Password" />
                    </div>
                    <div>
                        <button className='loginButton'>Sign Up</button>
                    </div>
                    <div className="signupText">
                        Already have an account? <a href="/login" className="signupLink">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}    

export default SignUp
