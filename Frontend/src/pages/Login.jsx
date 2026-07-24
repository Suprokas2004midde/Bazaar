import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backend } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backend}/api/user/register`, { name, email, password });
        if (response.data.success) {
          toast.success("Account created successfully!");
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backend}/api/user/login`, { email, password });
        if (response.data.success) {
          toast.success("Logged in successfully!");
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-[70vh] py-12">
      <Card className="w-full max-w-md border-[var(--border-color)] shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--secondary-accent)]/20 text-[var(--primary-accent)] flex items-center justify-center mx-auto mb-2">
            {currentState === 'Login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <CardTitle className="text-2xl font-extrabold text-[var(--text-main)]">
            {currentState === 'Login' ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {currentState === 'Login'
              ? 'Enter your credentials to access your account'
              : 'Fill in your details below to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {currentState === 'Sign Up' && (
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            )}

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-between items-center text-xs text-[var(--text-muted)] font-medium pt-1">
              <span className="cursor-pointer hover:underline hover:text-[var(--primary-accent)]">
                Forgot password?
              </span>
              {currentState === 'Login' ? (
                <span
                  onClick={() => setCurrentState('Sign Up')}
                  className="cursor-pointer font-bold text-[var(--primary-accent)] hover:underline"
                >
                  Create account
                </span>
              ) : (
                <span
                  onClick={() => setCurrentState('Login')}
                  className="cursor-pointer font-bold text-[var(--primary-accent)] hover:underline"
                >
                  Already have an account? Log In
                </span>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full font-bold uppercase tracking-wider mt-4">
              {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
