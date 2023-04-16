import React, { useState, useEffect } from "react";
// import useLogin from "../Hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {
    const [email, setEmail] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [pw, setPw] = useState("");
    // const { login, error, isLoading, isSucc } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // await login(email, pw);
        if (isSucc) {
            setTimeout(() => {
                navigate("/attendance");
            }, 1500);
        }
        // console.log(error);
    };

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="auth-form rounded-3xl flex-col justify-center items-center text-center mr-auto ml-auto mt-20 px-5 py-8 min-w-[10%] max-w-[30%] bg-gray-300"
        >
            <h3 className="font-bold text-xl mb-7 text-center">Sign In</h3>
            {/* <label htmlFor="em">Email</label> */}
            <input
                type="email"
                id="em"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Email address"
            />
            {/* <label htmlFor="pw">Password</label> */}
            <input
                type={passwordShown ? "text" : "password"}
                id="pw"
                onChange={(e) => setPw(e.target.value)}
                value={pw}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Password"
            />{" "}
            {passwordShown ? (
                <div className="text-center flex justify-center items-center align-middle m-0 p-0 mt-1 mb-4">
                    <span className="px-3">Hide</span>
                    <AiFillEyeInvisible
                        className=""
                        onClick={togglePassword}
                    />
                </div>
            ) : (
                <div className="text-center flex justify-center items-center align-middle m-0 p-0 mt-1 mb-4">
                    <span className="px-3">Show</span>
                    <AiFillEye
                        className=""
                        onClick={togglePassword}
                    />
                </div>
            )}
            <button
                // disabled={isLoading}
                onClick={(e) => {
                    setTimeout(() => {
                        navigate('/admin')
                    }, 1000)
                }}
                className="inline-block px-7 py-3 w-[75%] bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mb-8"
                type="submit"
            >
                Sign In
            </button>
            <Link to="/signup" className="block">
                Not yet registered?{" "}
                <span className="underline text-blue-900 hover:text-white">Signup</span>
            </Link>
        </form>
    );
}