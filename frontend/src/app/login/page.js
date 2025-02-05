"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 

const Login = ({ login, client }) => {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      // Send the login request to the backend
      const response = await client.login(
        e.target.username.value,
        e.target.password.value
      );
      
      // If successful, login and save token
      login(response.data.token);

      // Redirect to dashboard page after successful login
      router.push("/dashboard"); 

    } catch (error) {
      console.error("Login failed:", error);
      setDisabled(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FDB439] to-[#FA9D39]">
      <div className="flex flex-col items-center gap-4">
        {/* Logo Image */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="mb-6"
        />

        {/* Login Form */}
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold text-center text-[#333333] mb-6">
            Come on in!
          </h2>

          {/* Username Input */}
          <div className="mb-4 w-full">
            <label
              htmlFor="username"
              className="block text-[#333333] text-lg font-medium mb-2"
            ></label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Username"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 w-full">
            <label
              htmlFor="password"
              className="block text-[#333333] text-lg font-medium mb-2"
            ></label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-[#ddd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB439] bg-[#FAFAFA] text-[#333333] placeholder-[#999] transition duration-200"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled}
            className={`w-full py-3 rounded-md text-white font-semibold ${
              disabled ? "bg-[#DDA15E]" : "bg-[#FDB439] hover:bg-[#FA9D39]"
            } transition duration-200`}
          >
            {disabled ? "Signing in..." : "Sign in"}
          </button>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <Link
              href="/signup"
              className="ml-1 text-[#FDB439] hover:text-[#FA9D39] font-semibold text-md transition duration-200"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
