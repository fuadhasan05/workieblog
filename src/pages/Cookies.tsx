import { Layout } from '@/components/layout/Layout';

export default function Cookies() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground mb-12">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">1. What Are Cookies?</h2>
                <p>
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences and understand how you interact with the site.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
                <p>CareerBuddy uses cookies to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our website</li>
                  <li>Improve our Services based on usage patterns</li>
                  <li>Deliver relevant content and advertisements</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">3. Types of Cookies We Use</h2>
                
                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable core features like security, account access, and preferences. You cannot opt out of these cookies.
                </p>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Analytics Cookies</h3>
                <p>
                  These cookies help us understand how visitors interact with our website by collecting anonymous information. We use services like Google Analytics to analyze traffic patterns and improve user experience.
                </p>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Functional Cookies</h3>
                <p>
                  These cookies remember choices you make (such as language or region) to provide enhanced, personalized features. They may also be used to provide services you have requested.
                </p>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Marketing Cookies</h3>
                <p>
                  These cookies are used to track visitors across websites to display relevant advertisements. They help measure the effectiveness of advertising campaigns and limit how often you see an ad.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">4. Third-Party Cookies</h2>
                <p>
                  Some cookies on our website are set by third-party services we use, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong className="text-foreground">Google Analytics:</strong> Website analytics and performance tracking</li>
                  <li><strong className="text-foreground">Stripe:</strong> Payment processing for subscriptions</li>
                  <li><strong className="text-foreground">Social Media Platforms:</strong> Sharing buttons and embedded content</li>
                  <li><strong className="text-foreground">Email Service Providers:</strong> Newsletter tracking and delivery</li>
                </ul>
                <p className="mt-4">
                  These third parties have their own privacy policies governing the use of cookies. We recommend reviewing their policies for more information.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">5. Cookie Duration</h2>
                <p>Cookies can be either:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong className="text-foreground">Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
                  <li><strong className="text-foreground">Persistent Cookies:</strong> Remain on your device for a set period or until you delete them manually</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">6. Managing Cookies</h2>
                <p>
                  You can control and manage cookies in several ways:
                </p>
                
                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Browser Settings</h3>
                <p>
                  Most browsers allow you to view, manage, delete, and block cookies. Note that blocking all cookies may affect website functionality.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firefox</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
                </ul>

                <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-6">Opt-Out Tools</h3>
                <p>
                  You can opt out of targeted advertising through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative</a></li>
                  <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Digital Advertising Alliance</a></li>
                  <li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices (EU)</a></li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">7. Do Not Track</h2>
                <p>
                  Some browsers have a "Do Not Track" feature that signals websites not to track your online activity. Our website currently does not respond to DNT signals, but you can still manage cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">8. Changes to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post any changes on this page and update the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
                <p>
                  If you have questions about our use of cookies, please contact us at:
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
