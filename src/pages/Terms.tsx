import { Layout } from '@/components/layout/Layout';

export default function Terms() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-12">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using CareerBuddy's website, newsletters, and services ("Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">2. Description of Services</h2>
                <p>
                  CareerBuddy provides career-focused content, newsletters, and resources for African professionals. Our Services include but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Access to articles, videos, and career resources</li>
                  <li>Newsletter subscriptions</li>
                  <li>Community features and forums</li>
                  <li>Premium membership content (where applicable)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                <p>
                  Some features of our Services may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">4. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Use our Services for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our Services</li>
                  <li>Copy, reproduce, or distribute our content without permission</li>
                  <li>Use automated systems to access our Services without authorization</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">5. Intellectual Property</h2>
                <p>
                  All content on CareerBuddy, including text, graphics, logos, images, and software, is the property of CareerBuddy or its content suppliers and is protected by copyright and intellectual property laws. You may not use, reproduce, or distribute our content without express written permission.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">6. Subscriptions and Payments</h2>
                <p>
                  Some Services may require a paid subscription. By subscribing, you agree to pay all applicable fees. Subscriptions will automatically renew unless cancelled before the renewal date. Refunds are provided in accordance with our refund policy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">7. Disclaimer of Warranties</h2>
                <p>
                  Our Services are provided "as is" without warranties of any kind. We do not guarantee that our Services will be uninterrupted, error-free, or secure. Career advice and information provided are for general informational purposes only and should not be considered professional advice.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <p>
                  CareerBuddy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our Services. Our total liability shall not exceed the amount paid by you for our Services in the twelve months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">9. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our Services. Your continued use of our Services after changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
                <p>
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-4">
                  <strong className="text-foreground">Email:</strong> legal@careerbuddyhq.com<br />
                  <strong className="text-foreground">Address:</strong> Lagos, Nigeria
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
