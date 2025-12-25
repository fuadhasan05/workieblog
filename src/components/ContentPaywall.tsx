import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Lock } from 'lucide-react';
import { useMember } from '@/contexts/MemberContext';

interface ContentPaywallProps {
  accessLevel: 'FREE' | 'SUBSCRIBER' | 'PREMIUM';
  title?: string;
}

export const ContentPaywall = ({ accessLevel, title }: ContentPaywallProps) => {
  const { member, isAuthenticated } = useMember();

  const getMessage = () => {
    if (accessLevel === 'SUBSCRIBER' || accessLevel === 'PREMIUM') {
      return {
        title: accessLevel === 'PREMIUM' ? 'Premium Content' : 'Members-Only Content',
        description: accessLevel === 'PREMIUM'
          ? 'Upgrade to Premium or VIP to read this exclusive article'
          : 'Sign up for free or upgrade to access this content',
        icon: accessLevel === 'PREMIUM' ? Crown : Lock
      };
    }
    return { title: '', description: '', icon: Lock };
  };

  const message = getMessage();
  const Icon = message.icon;

  return (
    <div className="my-12 py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background" />
      <Card className="relative max-w-2xl mx-auto border-2 border-pink-200 bg-pink-50/50">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
              <Icon className="w-8 h-8 text-pink-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{message.title}</h3>
            <p className="text-gray-600">{message.description}</p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated ? (
              <>
                <Link to="/member/signup">
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/member/login">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {(accessLevel === 'PREMIUM' && member?.membershipTier === 'FREE') && (
                  <Link to="/pricing">
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                )}
                {accessLevel === 'SUBSCRIBER' && member?.membershipTier === 'FREE' && (
                  <Link to="/member/dashboard">
                    <Button variant="outline">
                      View Dashboard
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {accessLevel === 'PREMIUM' ? 'Starting at $9.99/month' : 'Free membership available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
