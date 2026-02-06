import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | MexicoHomeFinder',
  description: 'Privacy Policy for MexicoHomeFinder - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                MexicoHomeFinder ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
              </p>
              <p className="text-gray-700 mb-4">
                By using MexicoHomeFinder, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Register for an account</li>
                <li>Contact real estate agents through the Platform</li>
                <li>Subscribe to our newsletter</li>
                <li>Fill out forms or surveys</li>
                <li>Communicate with us</li>
              </ul>
              <p className="text-gray-700 mb-4">
                This information may include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Account credentials (username, password)</li>
                <li>Property search preferences and saved searches</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                When you access the Platform, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages viewed, time spent, click patterns)</li>
                <li>Location data (approximate geographic location based on IP address)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">2.3 Information from Third Parties</h3>
              <p className="text-gray-700 mb-4">
                We may receive information about you from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Real estate agents who list properties on our Platform</li>
                <li>Social media platforms if you connect your account</li>
                <li>Analytics providers</li>
                <li>Marketing partners</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide, maintain, and improve the Platform</li>
                <li>Process your property inquiries and connect you with agents</li>
                <li>Personalize your experience and provide relevant property recommendations</li>
                <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Analyze usage patterns and trends to improve our services</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">4. How We Share Your Information</h2>
              
              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">4.1 With Real Estate Agents</h3>
              <p className="text-gray-700 mb-4">
                When you express interest in a property, we share your contact information and inquiry details with the listing agent to facilitate communication.
              </p>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">4.2 With Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may share your information with third-party service providers who perform services on our behalf, such as:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Hosting and cloud storage providers</li>
                <li>Email service providers</li>
                <li>Analytics providers</li>
                <li>Payment processors</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">4.3 For Legal Purposes</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law or if we believe such action is necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Comply with legal obligations or governmental requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Investigate fraud or security issues</li>
                <li>Enforce our Terms of Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">4.4 Business Transfers</h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>

              <h3 className="text-xl font-semibold text-primary mb-3 mt-6">4.5 With Your Consent</h3>
              <p className="text-gray-700 mb-4">
                We may share your information for any other purpose with your explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to track activity on our Platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of the Platform.
              </p>
              <p className="text-gray-700 mb-4">
                Types of cookies we use:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the Platform to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use the Platform</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and backup systems</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
                <li><strong>Restrict Processing:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us at privacy@mexicohomefinder.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Platform is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and maintained on servers located outside of your country, where data protection laws may differ. By using the Platform, you consent to the transfer of your information to Mexico and other countries.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">11. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                The Platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">12. Email Communications</h2>
              <p className="text-gray-700 mb-4">
                If you no longer wish to receive marketing emails from us, you can unsubscribe by clicking the "unsubscribe" link at the bottom of any marketing email or by contacting us directly. Note that you may still receive transactional emails related to your account or property inquiries.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">13. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-gray-700 mb-4">
                We encourage you to review this Privacy Policy periodically. Your continued use of the Platform after any changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">14. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: jack@brokerlink.com<br />
                Address: San Miguel de Allende, Guanajuato, Mexico
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">15. Mexican Data Protection Laws</h2>
              <p className="text-gray-700 mb-4">
                As a company operating in Mexico, we comply with the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP). You have the right to access, rectify, cancel, or oppose (ARCO rights) the processing of your personal data by contacting us at the information provided above.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
