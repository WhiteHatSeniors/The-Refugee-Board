import React, { useState, useEffect } from "react";
// import useLogin from "../Hooks/useLogin";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { register } from "../utils/auth";
import { useQuery } from "@tanstack/react-query"
import { useLogin } from "../Hooks/useLogin";
import { useQueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from "../utils/axios";

export default function Login() {
    // const [email, setEmail] = useState("");
    // const [pw, setPw] = useState("");
    const [registerData, setRegisterData] = useState({})
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
    const location = useLocation();

    useEffect(() => {
        console.log(user)
        if (location.pathname == '/signup') {
            console.log('YOOOOOOOOOOOOO')
            console.log(user, JSON.parse(localStorage.getItem("id")))
            if (user?.CampId) navigate('/admin')
        }
    }, [user])

    const signUpFunc = async (signUpData) => {
        // const data = await AxFetch.get('/api/getId');
        // const { id } = data.data
        // console.log(data, id, "fdfdghffhdhfdhghdfg")
        // //Checking if user is authorized
        // if (id) return;
        return AxFetch.post(`/api/register`, signUpData)
    }

    const { mutate: signUpMutation, data: signUpData, isLoading } = useMutation(
        signUpFunc,
        {
            onSuccess: (data) => {
                console.log(data)
                if (data.status <= 299) {
                    console.log(data.data)
                    // localStorage.setItem("id", JSON.stringify(data.data.CampID))
                }
            },
            onError: (error) => {
                console.log(error)
            }
        }

    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signUpMutation(registerData)
        // navigate('/login')
        // setTimeout(() => {
        //     navigate("/attendance");
        // }, 1500);
    };

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="auth-form rounded-3xl flex-col justify-center items-center text-center mr-auto ml-auto mt-20 px-5 py-8 min-w-[10%] max-w-[30%] bg-gray-300"
        >
            <h3 className="font-bold text-xl mb-7 text-center">Sign Up</h3>
            {/* <label htmlFor="em">Email</label> */}
            <input
                type="email"
                id="em"
                onChange={(e) => setRegisterData(prev => ({ ...prev, CampEmail: e.target.value }))}
                value={registerData ? registerData.CampEmail : ""}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Email address"
            />
            {/* <label htmlFor="pw">Password</label> */}
            <input
                type="password"
                id="pw"
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                value={registerData ? registerData.password : ""}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Password"
            />{" "}
            <input
                type="password"
                id="cpw"
                onChange={(e) => setRegisterData(prev => ({ ...prev, ConfirmPassword: e.target.value }))}
                value={registerData ? registerData.ConfirmPassword : ""}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Confirm Password"
            />{" "}
            <input
                type="text"
                id="camp-name"
                onChange={(e) => setRegisterData(prev => ({ ...prev, CampName: e.target.value }))}
                value={registerData ? registerData.CampName : ""}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Camp Name"
            />{" "}
            <input
                type="text"
                id="camp-address"
                onChange={(e) => setRegisterData(prev => ({ ...prev, CampAddress: e.target.value }))}
                value={registerData ? registerData.CampAddress : ""}
                className="form-control block w-[75%] mx-auto px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none my-9"
                placeholder="Camp Address"
            />{" "}
            <button
                // disabled={isLoading}
                // onClick={(e) => {
                //     setTimeout(() => {
                //         navigate('/admin')
                //     }, 1000)
                // }}
                className={isLoading ? "inline-block px-7 py-3 w-[75%] bg-slate-500 text-black" : "inline-block px-7 py-3 w-[75%] bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mb-8"}
                disabled={isLoading ? true : false}
                type="submit"
            >
                Sign Up
            </button>
            <Link to="/login" className="block">
                Already registered?{" "}
                <span className="underline text-blue-900 hover:text-white">Login</span>
            </Link>
        </form>
    );
}