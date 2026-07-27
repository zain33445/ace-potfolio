import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | ACE SERVICES',
  description:
    'Terms and Conditions for ACE Services. Learn about the rules governing your use of our website and SMS messaging services.',
  alternates: {
    canonical: 'https://www.theaceservices.com/terms-and-conditions',
  },
  openGraph: {
  title: 'Terms and Conditions',
    description:
      'Terms and Conditions for ACE Services. Learn about the rules governing your use of our website and SMS messaging services.',
    url: 'https://www.theaceservices.com/terms-and-conditions',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <section className="min-h-screen bg-background pt-32 pb-20">
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto px-6 md:px-8">
        <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-[#111827] mb-2">
          Terms and Conditions
        </h1>
        <p className="font-mono text-sm text-[#6B7280] mb-10">
          Effective Date: 31-Dec-2025
        </p>

        <div className="space-y-10 font-sans text-[#374151] leading-relaxed">
          <p>
            Welcome to The ACE Services. These Terms and Conditions govern your use
            of our website and any communication, including SMS messaging, between
            you and The ACE Services.
          </p>

          {/* 1. Services */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              1. Services
            </h2>
            <p className="mb-4">
              The ACE Services provides pre-construction support including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Architecture &amp; Structural Design</li>
              <li>Project Management &amp; Procurement</li>
              <li>Drafting &amp; 3D Renderings</li>
              <li>Permit Sets &amp; PE-Stamped Drawings</li>
              <li>MEP &amp; Submission Drawings</li>
              <li>Cost Estimation &amp; Take-Offs</li>
              <li>Shop Drawing &amp; Submittals</li>
            </ul>
          </section>

          {/* 2. SMS Messaging */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              2. SMS Messaging
            </h2>
            <p className="mb-4">
              By providing your phone number and opting in to receive messages from
              The ACE Services, you consent to receive SMS messages regarding project
              updates, service reminders, and offers.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Message frequency: Varies per user</li>
              <li>Message &amp; data rates may apply</li>
              <li>
                You may opt out anytime by replying <strong>STOP</strong>
              </li>
              <li>
                For help, reply <strong>HELP</strong> or contact us at{' '}
                <a
                  href="mailto:a.manan@theaceservices.com"
                  className="text-primary hover:underline"
                >
                  a.manan@theaceservices.com
                </a>
              </li>
            </ul>
            <p>
              We use industry-standard platforms and carrier-approved 10DLC messaging
              routes to ensure your data and communication remain secure.
            </p>
          </section>

          {/* 3. Use of Website */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              3. Use of Website
            </h2>
            <p>
              You agree not to misuse the site or interfere with its security
              features. All content is protected by intellectual property laws and
              cannot be copied or redistributed without permission.
            </p>
          </section>

          {/* 4. Limitation of Liability */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              4. Limitation of Liability
            </h2>
            <p>
              ACE Services is not responsible for any indirect or consequential
              damages resulting from the use of our services.
            </p>
          </section>

          {/* 5. Modifications */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              5. Modifications
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use
              of our services constitutes acceptance of those changes.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
