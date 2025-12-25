import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';
import { useMember } from '@/contexts/MemberContext';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

const STRIPE_PREMIUM_PRICE_ID = 'price_premium_monthly_id';  // Replace with actual Stripe price ID
const STRIPE_VIP_PRICE_ID = 'price_vip_monthly_id';  // Replace with actual Stripe price ID

const plans = [
  {
    name: 'Free',
    tier: 'FREE',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic access',
    features: [
      'Access to free articles',
      'Weekly newsletter',
      'Community access',
      'Mobile app access'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Premium',
    tier: 'PREMIUM',
    price: '$9.99',
    period: 'per month',
    description: 'Unlock premium content and features',
    features: [
      'Everything in Free',
      'Access to premium articles',
      'Ad-free experience',
      'Early access to new content',
      'Save unlimited articles',
      'Priority support'
    ],
    cta: 'Upgrade to Premium',
    priceId: STRIPE_PREMIUM_PRICE_ID,
    highlighted: true
  },
  {
    name: 'VIP',
    tier: 'VIP',
    price: '$19.99',
    period: 'per month',
    description: 'The ultimate CareerBuddy experience',
    features: [
      'Everything in Premium',
      'Exclusive VIP-only content',
      'Monthly live Q&A sessions',
      'Career coaching sessions',
      'Networking events access',
      'VIP community forum',
      'Annual gift box'
    ],
    cta: 'Upgrade to VIP',
    priceId: STRIPE_VIP_PRICE_ID,
    highlighted: false
  }
];

export default function Pricing() {
  const { member, isAuthenticated } = useMember();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: any) => {
    if (plan.tier === 'FREE') {
      if (!isAuthenticated) {
        navigate('/member/signup');
      } else {
        navigate('/member/dashboard');
      }
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to upgrade your membership');
      navigate('/member/login');
      return;
    }

    if (member?.membershipTier === plan.tier) {
      toast.info('You already have this membership tier');
      return;
    }

    try {
      setLoadingPlan(plan.tier);
      const data = await apiClient.post('/subscriptions/create-checkout-session', {
        priceId: plan.priceId,
        tier: plan.tier
      });

      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive content, connect with a community of career-driven women, and access premium resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = member?.membershipTier === plan.tier;
            const isLoading = loadingPlan === plan.tier;

            return (
              <Card
                key={plan.tier}
                className={`relative ${plan.highlighted ? 'border-pink-600 border-2 shadow-xl' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-pink-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {plan.tier !== 'FREE' && <Crown className="w-6 h-6 text-pink-600" />}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-pink-600 hover:bg-pink-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentPlan || isLoading}
                  >
                    {isLoading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-pink-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions about pricing?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            All paid memberships include a 7-day money-back guarantee. Cancel anytime, no questions asked.
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </Layout>
  );
}
