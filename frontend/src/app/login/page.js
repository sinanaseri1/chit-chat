"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 

const Login = ({ login, client }) => {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setDisabled(true); // Disable the button while submitting
  
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    try {
      // Send the login request to the backend via an API call
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Make sure to send JSON
        },
        body: JSON.stringify({ username, password }), // Send the form data
      });

      console.log(response)
  
      // If the login was successful (status 200), we handle the response
      if (response.ok) {
        // Optionally you can parse the response if needed

        //const data = await response.json();
  
        // Store the token or handle other data from the response
        
        //login(data.token); // Assuming login() stores the JWT token
  
        // Redirect to the dashboard after successful login
        router.push("/dashboard"); 
      } else {
        // Handle failed login attempts
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        setDisabled(false); // Re-enable the button
      }
  
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      setDisabled(false); // Re-enable the button on error
    }
  };
  

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   setDisabled(true);

    // try {
    //   // Send the login request to the backend
    //   const response = await client.login(
    //     e.target.username.value,
    //     e.target.password.value
    //   );

      /**
      fetch('/testing', {
        method: 'POST',

      })
      .then(response => response.json())
      .then(data => {
        console.log(data.status)
        return data
      })
      **/

  //     // If successful, login and save token
  //     login(response.data.token);

  //     // Redirect to dashboard page after successful login
  //     router.push("/dashboard"); 

  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     setDisabled(false);
  //   }
  // };

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
