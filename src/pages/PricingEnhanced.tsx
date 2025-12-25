import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Crown, CreditCard, Wallet, DollarSign } from 'lucide-react';
import { useMember } from '@/contexts/MemberContext';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

// Currency pricing configuration
const PRICING = {
  PREMIUM: {
    usd: { amount: 9.99, symbol: '$', label: 'US Dollar' },
    eur: { amount: 9.49, symbol: '€', label: 'Euro' },
    gbp: { amount: 8.49, symbol: '£', label: 'British Pound' },
    ngn: { amount: 8000, symbol: '₦', label: 'Nigerian Naira' },
    ghs: { amount: 140, symbol: '₵', label: 'Ghanaian Cedi' },
    zar: { amount: 180, symbol: 'R', label: 'South African Rand' },
    kes: { amount: 1300, symbol: 'KSh', label: 'Kenyan Shilling' },
  },
  VIP: {
    usd: { amount: 19.99, symbol: '$', label: 'US Dollar' },
    eur: { amount: 18.49, symbol: '€', label: 'Euro' },
    gbp: { amount: 16.49, symbol: '£', label: 'British Pound' },
    ngn: { amount: 16000, symbol: '₦', label: 'Nigerian Naira' },
    ghs: { amount: 280, symbol: '₵', label: 'Ghanaian Cedi' },
    zar: { amount: 360, symbol: 'R', label: 'South African Rand' },
    kes: { amount: 2600, symbol: 'KSh', label: 'Kenyan Shilling' },
  },
};

// Payment gateway configuration
const GATEWAYS = {
  stripe: {
    name: 'Credit/Debit Card',
    icon: CreditCard,
    currencies: ['usd', 'eur', 'gbp'],
    description: 'Visa, Mastercard, American Express'
  },
  paystack: {
    name: 'Paystack',
    icon: Wallet,
    currencies: ['ngn', 'ghs', 'zar', 'kes'],
    description: 'Card, Bank Transfer, Mobile Money'
  },
  paypal: {
    name: 'PayPal',
    icon: DollarSign,
    currencies: ['usd', 'eur', 'gbp'],
    description: 'PayPal Balance, Credit Card'
  },
};

const plans = [
  {
    name: 'Free',
    tier: 'FREE',
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
    highlighted: true
  },
  {
    name: 'VIP',
    tier: 'VIP',
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
    highlighted: false
  }
];

export default function Pricing() {
  const { member, isAuthenticated } = useMember();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currency, setCurrency] = useState('usd');
  const [gateway, setGateway] = useState('stripe');

  // Get appropriate gateway based on currency
  const getGatewayForCurrency = (curr: string) => {
    if (['ngn', 'ghs', 'zar', 'kes'].includes(curr)) return 'paystack';
    if (['usd', 'eur', 'gbp'].includes(curr)) return 'stripe';
    return 'stripe';
  };

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setGateway(getGatewayForCurrency(newCurrency));
  };

  // Get available currencies for selected gateway
  const getAvailableCurrencies = () => {
    return Object.entries(PRICING.PREMIUM)
      .filter(([curr]) => GATEWAYS[gateway as keyof typeof GATEWAYS].currencies.includes(curr))
      .map(([code, data]) => ({ code, ...data }));
  };

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

      // Use new unified payments endpoint
      const data = await apiClient.post('/payments/create-checkout', {
        tier: plan.tier,
        currency,
        gateway
      });

      // Redirect based on gateway
      if (gateway === 'stripe' && data.url) {
        window.location.href = data.url;
      } else if (gateway === 'paystack' && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else if (gateway === 'paypal' && data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPriceDisplay = (tier: string) => {
    if (tier === 'FREE') return 'Free';

    const price = PRICING[tier as keyof typeof PRICING]?.[currency as keyof typeof PRICING.PREMIUM];
    if (!price) return '-';

    return `${price.symbol}${price.amount.toLocaleString()}`;
  };

  const GatewayIcon = GATEWAYS[gateway as keyof typeof GATEWAYS].icon;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Unlock exclusive content, connect with a community of career-driven women, and access premium resources
          </p>

          {/* Payment Method Selector */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="w-full sm:w-64">
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRICING.PREMIUM).map(([code, data]) => (
                    <SelectItem key={code} value={code}>
                      {data.symbol} {data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <GatewayIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">{GATEWAYS[gateway as keyof typeof GATEWAYS].name}</span>
              <Badge variant="secondary" className="text-xs">
                {GATEWAYS[gateway as keyof typeof GATEWAYS].description}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = member?.membershipTier === plan.tier;
            const isLoading = loadingPlan === plan.tier;
            const price = getPriceDisplay(plan.tier);

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
                    <span className="text-4xl font-bold">{price}</span>
                    {plan.tier !== 'FREE' && (
                      <span className="text-gray-600 ml-2">per month</span>
                    )}
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

        <div className="bg-pink-50 rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Pay in Your Local Currency</h2>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            We support multiple payment methods and currencies to make it easy for you to subscribe from anywhere in the world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="outline" className="text-sm py-2 px-4">
              <CreditCard className="w-4 h-4 mr-2" />
              Cards (Stripe)
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Wallet className="w-4 h-4 mr-2" />
              Paystack (Africa)
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <DollarSign className="w-4 h-4 mr-2" />
              PayPal
            </Badge>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions about pricing?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            All paid memberships include a 7-day money-back guarantee. Cancel anytime, no questions asked.
            Prices may vary based on your currency and local taxes.
          </p>
          <Button variant="outline">Contact Support</Button>
        </div>
      </div>
    </Layout>
  );
}
