import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useMember } from '@/contexts/MemberContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';

export default function Signup() {
  const [formData, setFormData] = useState({ 
    email: '', 
    name: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [useFirebase, setUseFirebase] = useState(true); // Always use Firebase by default
  const { signInWithGoogle } = useFirebaseAuth();
  const { register: memberRegister } = useMember();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Add timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      toast.error('Registration is taking too long. Please try again.');
    }, 30000); // 30 second timeout

    try {
      if (useFirebase) {
        // Register with Firebase Authentication
        console.log('🚀 Starting Firebase Authentication registration...');
        console.log('📧 Email:', formData.email);
        console.log('🔐 Password length:', formData.password.length);
        
        // Add delay to ensure Firebase is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          // First, create the authentication account
          console.log('⏳ Calling createUserWithEmailAndPassword...');
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
          );

          console.log('📋 Raw userCredential:', userCredential);
          console.log('👤 User object:', userCredential.user);

          if (!userCredential || !userCredential.user) {
            throw new Error('❌ createUserWithEmailAndPassword returned null/undefined');
          }

          const user = userCredential.user;
          console.log('✅ Firebase Authentication SUCCESS!');
          console.log('🆔 User UID:', user.uid);
          console.log('📧 User Email:', user.email);
          console.log('📧 Email Verified:', user.emailVerified);
          console.log('📅 Creation Time:', user.metadata.creationTime);

          // Update the user's profile with display name
          console.log('📝 Updating user profile...');
          await updateProfile(user, {
            displayName: formData.name
          });
          console.log('✅ Profile updated successfully');

          // Store in Firestore - only after successful authentication
          console.log('💾 Storing user data in Firestore...');
          const userDoc = {
            uid: user.uid,
            email: user.email,
            displayName: formData.name,
            photoURL: user.photoURL || null,
            emailVerified: user.emailVerified,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            membershipTier: 'FREE',
            isActive: true,
            provider: 'email',
            metadata: {
              creationTime: user.metadata.creationTime,
              lastSignInTime: user.metadata.lastSignInTime
            }
          };
          
          await setDoc(doc(db, 'users', user.uid), userDoc);
          console.log('✅ User data stored in Firestore successfully');

          // Verify the user is authenticated
          console.log('🔍 Current auth user:', auth.currentUser?.uid);
          console.log('🔍 Current auth email:', auth.currentUser?.email);

          toast.success('🎉 Account created successfully! You are now logged in.');
          navigate('/member/dashboard');
          
        } catch (authError: any) {
          console.error('❌ Firebase Authentication Error:', authError);
          console.error('❌ Error code:', authError.code);
          console.error('❌ Error message:', authError.message);
          console.error('❌ Full error object:', authError);
          throw authError; // Re-throw to be caught by outer try-catch
        }
        
      } else {
        // Fallback: Register with traditional backend method (still try Firebase first)
        console.log('Attempting Firebase registration as fallback...');
        try {
          // Try Firebase registration even when checkbox is unchecked
          console.log('Attempting Firebase Authentication as fallback...');
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
          );
          
          if (!userCredential.user) {
            throw new Error('Firebase account creation failed');
          }
          
          console.log('✅ Fallback Firebase Authentication successful:', userCredential.user.uid);
          
          await updateProfile(userCredential.user, {
            displayName: formData.name
          });
          
          // Store user in Firestore only after successful authentication
          const userDoc = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: formData.name,
            photoURL: userCredential.user.photoURL || null,
            emailVerified: userCredential.user.emailVerified,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            membershipTier: 'FREE',
            isActive: true,
            provider: 'email'
          };
          await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
          console.log('✅ Fallback: User stored in Firestore after successful auth');
          
          toast.success('Account created successfully!');
          navigate('/member/dashboard');
          return;
        } catch (firebaseError: any) {
          console.log('Firebase registration failed:', firebaseError);
          
          // Handle specific Firebase errors immediately
          if (firebaseError.code === 'auth/email-already-in-use') {
            toast.error('This email is already registered. Please try logging in instead.');
            return;
          } else if (firebaseError.code === 'auth/weak-password') {
            toast.error('Password is too weak. Please use a stronger password.');
            return;
          } else if (firebaseError.code === 'auth/network-request-failed') {
            toast.error('Network error. Please check your connection and try again.');
            return;
          }
        }
        
        // Traditional method fallback with better error handling
        try {
          await memberRegister(formData.email, formData.name, formData.password);
          toast.success('Account created successfully!');
          navigate('/member/dashboard');
        } catch (traditionalError: any) {
          console.error('Traditional registration also failed:', traditionalError);
          
          if (traditionalError.message?.includes('already exists')) {
            toast.error('Email already registered. Please try logging in.');
          } else {
            toast.error('Registration failed. Please try again later.');
          }
        }
      }
    } catch (error: any) {
      console.error('🔴 REGISTRATION ERROR:', error);
      console.error('🔴 Error Type:', typeof error);
      console.error('🔴 Error Code:', error?.code);
      console.error('🔴 Error Message:', error?.message);
      console.error('🔴 Error Stack:', error?.stack);
      
      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        toast.error('❌ Email already registered. Try logging in instead.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('❌ Password too weak. Use at least 6 characters with letters and numbers.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('❌ Invalid email format. Please check your email address.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('❌ Network error. Check your internet connection.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('❌ Too many attempts. Please wait and try again later.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('❌ Email/password authentication not enabled. Contact support.');
      } else if (error.code === 'auth/configuration-not-found') {
        toast.error('❌ Firebase configuration error. Contact support.');
      } else if (error.message?.includes('Firebase') || error.message?.includes('firestore')) {
        toast.error(`❌ Firebase service error: ${error.message}`);
      } else {
        toast.error(`❌ Registration failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      clearTimeout(timeoutId); // Clear timeout
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Google signup...');
      const result = await signInWithGoogle();
      
      if (!result?.user) {
        throw new Error('Google sign-in failed - no user returned');
      }
      
      console.log('✅ Google Authentication successful:', result.user.uid);
      
      // Store Google user in Firestore after successful authentication
      console.log('Storing Google user in Firestore...');
      const userDoc = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || 'Google User',
        photoURL: result.user.photoURL || null,
        emailVerified: result.user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        membershipTier: 'FREE',
        isActive: true,
        provider: 'google'
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userDoc);
      console.log('✅ Google user stored in Firestore successfully');
      
      toast.success('Account created successfully with Google!');
      navigate('/member/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please enable popups and try again.');
      } else {
        toast.error(error.message || 'Google signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join CareerBuddy and get access to exclusive content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign Up Button */}
            <Button
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Creating account...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="Confirm your password"
                />
              </div>
              
              {/* Removed the confusing authentication method selector - Firebase is now the default */}
              <div className="text-center text-sm text-gray-600 bg-green-50 p-2 rounded">
                🔐 Secure registration with Firebase Authentication
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/member/login" className="text-pink-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
