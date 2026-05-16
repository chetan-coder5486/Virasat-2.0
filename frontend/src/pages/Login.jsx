import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assumes you're using React Router
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // 1. Full-screen background with overlay
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Shade Overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-bg-D1VU07Ny.jpg" // Same as HomePage
          alt="Family memories"
          className="h-full w-full object-cover"
        />
        {/* Deep overlay to make the login card stand out */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* 2. Modified Card (Using backdrop-blur and slight transparency) */}
      <Card className="w-full max-w-sm relative z-10 bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          {/* Consistency check: you might want to add the TreePine icon here */}
          <CardTitle className="text-2xl font-bold font-serif text-gray-950">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email to access your Family Trunk
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-[#A65E2E] transition"
                />
              </div>

              {/* Password Input */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-gray-900 font-medium"
                  >
                    Password
                  </Label>
                  {/* Styling the 'Forgot password?' link with the brown color on hover */}
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-[#A65E2E] hover:text-[#8e4f26] transition hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-[#A65E2E] transition"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            {/* 3. The Primary Button (Using the exact brown color and hover effect) */}
            <Button
              type="submit"
              className="w-full bg-[#A65E2E] hover:bg-[#8e4f26] text-white shadow-lg transition-all duration-200"
            >
              Login
            </Button>

            {/* Styled Secondary Link */}
            <p className="text-sm text-center text-gray-700 mt-2">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#A65E2E] hover:text-[#8e4f26] transition hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
