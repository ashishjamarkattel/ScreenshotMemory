import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/login', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.authenticated) {
          setLocation('/home');
        } else {
          setError("Invalid credentials");
        }
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#00DC82]" />
            <span className="text-xl font-bold text-white">MemoriesHub</span>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-gray-400">Sign in to access your memories</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#00DC82] hover:bg-[#00B669] text-black font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black/80 rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => setLocation('/signup')}
                  className="text-[#00DC82] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 