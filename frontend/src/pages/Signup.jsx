import React, { useState, useEffect } from "react";
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
import { Check, X, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  // Validation State
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    setValidations({
      minLength: formData.password.length >= 8,
      hasNumber: /\d/.test(formData.password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    });
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Object.values(validations).every(Boolean)) return;

    try {
      setSubmitting(true);
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch (err) {
      setError("Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const ValidationItem = ({ isMet, text }) => (
    <div
      className={`flex items-center gap-2 text-xs transition-colors ${isMet ? "text-green-600" : "text-gray-500"}`}
    >
      {isMet ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background with Theme Consistency */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-bg-D1VU07Ny.jpg"
          alt="Family memories"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-md shadow-2xl border-white/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif font-bold text-center text-gray-900">
            Begin Your Trunk
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Create an account to start preserving your legacy
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
                className="focus:ring-[#A65E2E]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                onChange={handleChange}
                className="focus:ring-[#A65E2E]"
              />
            </div>

            <div className="grid gap-2 relative">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  className="pr-10 focus:ring-[#A65E2E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Real-time Password Rules Overlay */}
              <div className="grid grid-cols-2 gap-2 mt-1 p-2 bg-gray-50 rounded-md border border-gray-100">
                <ValidationItem
                  isMet={validations.minLength}
                  text="At least 8 characters"
                />
                <ValidationItem
                  isMet={validations.hasNumber}
                  text="At least 1 number"
                />
                <ValidationItem
                  isMet={validations.hasSpecial}
                  text="1 special character"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {error ? (
              <p className="text-sm text-red-600 text-center">{error}</p>
            ) : null}
            <Button
              type="submit"
              className="w-full bg-[#A65E2E] hover:bg-[#8e4f26] text-white py-6 text-lg font-semibold transition-all"
              disabled={
                !Object.values(validations).every(Boolean) || submitting
              }
            >
              {submitting ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Already part of a family?{" "}
              <Link
                to="/login"
                className="text-[#A65E2E] font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
