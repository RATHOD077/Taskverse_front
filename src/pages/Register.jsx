import React from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1f] text-white">

      {/* Glow */}
      <div className="absolute w-full h-full bg-gradient-to-br from-[#00f5ff20] to-[#7b2cff20] blur-[3rem] -z-10"></div>

      <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-[2.5rem] rounded-[1rem] w-[90%] max-w-[30rem]">

        <h2 className="text-[2rem] font-bold text-center text-purple-400">
          Create Account
        </h2>

        <div className="mt-[2rem] space-y-[1.5rem]">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-[0.8rem] rounded-[0.5rem] bg-transparent border border-white/20 focus:border-purple-400 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-[0.8rem] rounded-[0.5rem] bg-transparent border border-white/20 focus:border-purple-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-[0.8rem] rounded-[0.5rem] bg-transparent border border-white/20 focus:border-purple-400 outline-none"
          />

          <button className="w-full py-[0.8rem] rounded-[0.6rem] bg-gradient-to-r from-purple-500 to-cyan-400 hover:scale-105 transition">
            Register
          </button>

        </div>

        <p className="mt-[1.5rem] text-center text-gray-400 text-[0.9rem]">
          Already have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
