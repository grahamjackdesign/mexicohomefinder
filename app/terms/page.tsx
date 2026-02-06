import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | MexicoHomeFinder',
  description: 'Terms of Service for MexicoHomeFinder - Read our terms and conditions for using our real estate platform.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using MexicoHomeFinder ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                MexicoHomeFinder is a real estate listing platform that connects property buyers with real estate agents and property sellers in Mexico. We provide a marketplace for property listings, search functionality, and communication tools between buyers and agents.
              </p>
              <p className="text-gray-700 mb-4">
                The Platform does not own, sell, rent, or manage any properties listed. We are a technology platform that facilitates connections between parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Platform, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">4. Property Listings</h2>
              <p className="text-gray-700 mb-4">
                Property listings on the Platform are provided by third-party real estate agents and sellers. MexicoHomeFinder:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Does not verify the accuracy of property information, descriptions, or photos</li>
                <li>Is not responsible for the condition, legality, or availability of listed properties</li>
                <li>Does not guarantee that any property listing will result in a successful transaction</li>
                <li>Reserves the right to remove any listing that violates these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">5. User Conduct</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Post false, misleading, or fraudulent property listings or information</li>
                <li>Harass, abuse, or harm other users or agents</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Transmit spam, viruses, or malicious code</li>
                <li>Scrape, copy, or harvest data from the Platform without permission</li>
                <li>Impersonate another person or entity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">6. Fees and Payments</h2>
              <p className="text-gray-700 mb-4">
                Access to the Platform for property search is currently free for buyers. Real estate agents may be subject to subscription fees or commission arrangements as outlined in separate agent agreements.
              </p>
              <p className="text-gray-700 mb-4">
                All fees are non-refundable unless otherwise stated. We reserve the right to change our fee structure with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Platform and its original content, features, and functionality are owned by MexicoHomeFinder and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 mb-4">
                You may not reproduce, distribute, modify, or create derivative works of any content from the Platform without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700 mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>The Platform will be uninterrupted, secure, or error-free</li>
                <li>Property information is accurate, complete, or current</li>
                <li>Any property transaction will be successful</li>
                <li>Defects will be corrected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEXICOHOMEFINDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-gray-700 mb-4">
                This includes but is not limited to damages arising from property transactions, agent relationships, or information obtained through the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify, defend, and hold harmless MexicoHomeFinder, its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any property transactions you enter into</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">11. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                The Platform may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites. You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of third-party services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including but not limited to breach of these Terms.
              </p>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Mexico, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">14. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with Mexican law, except where prohibited by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">15. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on the Platform and updating the "Last Updated" date.
              </p>
              <p className="text-gray-700 mb-4">
                Your continued use of the Platform after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">16. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: jack@brokerlink.com<br />
                Address: San Miguel de Allende, Guanajuato, Mexico
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
