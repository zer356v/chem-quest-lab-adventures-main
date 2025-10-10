import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Beaker, FlaskConical } from 'lucide-react';
import login from '../assets/login.jpeg'
import login1 from '../assets/login1.jpeg'
import login2 from '../assets/login2.jpeg'
import logo from '../assets/Reactron_Logo.png'

const images = [
  login,
  login1,
  login2
];

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/lab');
    return null;
  }

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '', password: '', fullName: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      navigate('/lab');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (signupForm.password.length < 6) {
      toast({
        title: 'Signup Failed',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    try {
      await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      toast({ title: 'Account Created!', description: 'Welcome to Science Lab!' });
      navigate('/lab');
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: 'Welcome!', description: 'Signed in with Google.' });
      navigate('/lab');
    } catch (error) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-900 via-gray-900 to-black overflow-hidden text-white">

      {/* LEFT SIDE - Scrolling Images */}
      <motion.div
        className="relative md:w-1/2 w-full h-64 md:h-auto overflow-hidden"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{ y: ['0%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          >
            {images.concat(images).map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Science Lab"
                className="w-full h-[50vh] object-cover opacity-80"
              />
            ))}
          </motion.div>
        </div>

        {/* Overlay text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center p-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-purple-300"
          >
            Virtual Science Lab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl max-w-md text-white/80"
          >
            Discover interactive experiments and unlock your inner scientist 🔬
          </motion.p>
        </div>

        {/* Purple Glow */}
        <motion.div
          className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* RIGHT SIDE - Auth Card */}
      <motion.div
        className="flex items-center justify-center md:w-1/2 p-6 relative"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow */}
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <Card className="w-full max-w-md shadow-2xl border border-white/20 bg-white/10 backdrop-blur-2xl text-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={logo} alt="Logo" className="w-30 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-purple-300">
              Login or Sign Up
            </CardTitle>
            <CardDescription className="text-white/70">
              Join our futuristic chemistry platform
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN FORM */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-blue-200 text-white hover:text-black"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center text-sm mt-4 text-white/70">or</div>
                <Button
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-600 hover:bg-blue-200 text-white hover:text-black"
                  onClick={handleSignUpWithGoogle}
                >
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </Button>
              </TabsContent>

              {/* SIGNUP FORM */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-400 hover:bg-blue-200 text-white hover:text-black"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="text-center text-sm mt-4 text-white/70">or</div>
                <Button
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-400 hover:bg-blue-200 text-white hover:text-black"
                  onClick={handleSignUpWithGoogle}
                >
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                  Sign up with Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="text-center text-sm text-white/70">
            Start your chemistry journey today! 🧪
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
