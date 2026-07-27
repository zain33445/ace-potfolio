import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ACE SERVICES',
  description:
    'Privacy Policy for ACE Services. Learn how we collect, use, and protect your information, including SMS communication and data security practices.',
  alternates: {
    canonical: 'https://www.theaceservices.com/privacy-policy',
  },
  openGraph: {
  title: 'Privacy Policy',
    description:
      'Privacy Policy for ACE Services. Learn how we collect, use, and protect your information.',
    url: 'https://www.theaceservices.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-background pt-32 pb-20">
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto px-6 md:px-8">
        <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-[#111827] mb-2">
          Privacy Policy
        </h1>
        <p className="font-mono text-sm text-[#6B7280] mb-10">
          Effective Date: 31-Dec-2025
        </p>

        <div className="space-y-10 font-sans text-[#374151] leading-relaxed">
          <p>
            At ACE Services, your privacy is important to us. This policy explains
            how we collect, use, and protect your information.
          </p>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">We may collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email, phone number</li>
              <li>Project details</li>
              <li>Communication preferences</li>
              <li>Data from cookies or site usage</li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide architectural and pre-construction services</li>
              <li>
                To send service updates, invoices, and notifications via email or SMS
              </li>
              <li>To improve our website and services</li>
            </ul>
          </section>

          {/* 3. SMS and Communication */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              3. SMS and Communication
            </h2>
            <p className="mb-4">
              By submitting your phone number, you agree to receive SMS
              communications. All messages are sent through 10DLC-compliant routes to
              ensure deliverability and security.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>
                You may opt out at any time by replying <strong>STOP</strong>
              </li>
              <li>
                To receive assistance, reply <strong>HELP</strong> or contact us at{' '}
                <a
                  href="mailto:a.manan@theaceservices.com"
                  className="text-primary hover:underline"
                >
                  a.manan@theaceservices.com
                </a>
              </li>
            </ul>
            <p>
              We do not share your phone number or personal information with
              third-party marketers.
            </p>
          </section>

          {/* 4. Cookies */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              4. Cookies
            </h2>
            <p>
              Our website may use cookies to track browsing behavior and site
              performance. You can disable cookies in your browser settings.
            </p>
          </section>

          {/* 5. Data Security */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              5. Data Security
            </h2>
            <p>
              We take reasonable measures to protect your information using secure
              systems and best practices.
            </p>
          </section>

          {/* 6. Third-Party Tools */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              6. Third-Party Tools
            </h2>
            <p>
              We use tools like PlanSwift and Bluebeam. Your interaction with these
              tools may be governed by their respective privacy policies.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              7. Your Rights
            </h2>
            <p className="mb-4">You may:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Request a copy of your personal data</li>
              <li>Ask us to delete or correct your information</li>
            </ul>
          </section>

          {/* 8. Changes to Policy */}
          <section>
            <h2 className="font-sans text-2xl font-bold text-[#111827] mb-4">
              8. Changes to Policy
            </h2>
            <p>
              We may update this Privacy Policy occasionally. The updated version
              will be posted on this page with the revised date.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
