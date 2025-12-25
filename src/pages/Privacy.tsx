import { Layout } from '@/components/layout/Layout';

export default function Privacy() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-12">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <p>
                  At CareerBuddy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, newsletters, and services. Please read this policy carefully.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Name and email address</li>
                  <li>Account credentials</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Profile information and preferences</li>
                  <li>Communications you send to us</li>
                </ul>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Automatically Collected Information</h3>
                <p>When you use our Services, we may automatically collect:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Usage data (pages visited, time spent, clicks)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide, maintain, and improve our Services</li>
                  <li>Send newsletters and marketing communications</li>
                  <li>Process payments and subscriptions</li>
                  <li>Respond to your inquiries and provide support</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">4. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong className="text-foreground">Service Providers:</strong> Third parties that help us operate our Services (email providers, payment processors, analytics)</li>
                  <li><strong className="text-foreground">Business Partners:</strong> With your consent, for joint marketing or promotional activities</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong className="text-foreground">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
                <p className="mt-4">We do not sell your personal information to third parties.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">5. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookie preferences through your browser settings. Note that disabling cookies may affect some features of our Services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
                <p>Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-4">To exercise these rights, please contact us at privacy@careerbuddyhq.com.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">8. Newsletter and Email Communications</h2>
                <p>
                  When you subscribe to our newsletters, we collect your email address and may track email opens and clicks to improve our content. You can unsubscribe at any time by clicking the unsubscribe link in any email or contacting us directly.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">9. Third-Party Links</h2>
                <p>
                  Our Services may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">10. Children's Privacy</h2>
                <p>
                  Our Services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our Services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="mt-4">
                  <strong className="text-foreground">Email:</strong> privacy@careerbuddyhq.com<br />
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
