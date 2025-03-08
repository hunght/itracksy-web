import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'BubbyBeep Privacy Policy | Data Collection and Usage for Chrome Extension',
  description: 'Privacy policy for BubbyBeep Chrome extension',
};

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Privacy Policy for BubbyBeep
      </h1>
      <p className="mb-8 text-center text-sm text-gray-600">
        Last updated: 2024-07-01
      </p>

      <section>
        <p>
          {`We operate the BubbyBeep Chrome extension (hereinafter referred to as
          the "Service").`}
        </p>
        <p className="mt-2">
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal data when you use our Service and the
          choices you have associated with that data.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Information Collection And Use
        </h2>
        <p>
          We collect several different types of information for various purposes
          to provide and improve our Service to you.
        </p>
      </section>

      <section className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Types of Data Collected</h3>
        <h4 className="mb-2 text-lg font-medium">Personal Data</h4>
        <p>
          {` While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you ("Personal Data").`}
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>Email address</li>
          <li>Cookies and Usage Data</li>
        </ul>
      </section>

      <section className="mt-8">
        <h4 className="mb-2 text-lg font-medium">Usage Data</h4>
        <p>
          When you access the Service by or through a browser, we may collect
          certain information automatically.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Use of Data</h2>
        <p>iTracksy uses the collected data for various purposes:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>
            To allow you to participate in interactive features of our Service
            when you choose to do so
          </li>
          <li>To provide customer care and support</li>
          <li>
            To provide analysis or valuable information so that we can improve
            the Service
          </li>
          <li>To monitor the usage of the Service</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Transfer Of Data</h2>
        <p>
          Your information, including Personal Data, may be transferred to — and
          maintained on — computers located outside of your state, province,
          country, or other governmental jurisdiction where the data protection
          laws may differ from those from your jurisdiction.
        </p>
        <p className="mt-2">
          iTracksy will take all steps reasonably necessary to ensure that your
          data is treated securely and in accordance with this Privacy Policy
          and no transfer of your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of your data and other personal information.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Disclosure Of Data</h2>
        <p>
          iTracksy may disclose your Personal Data in the good faith belief that
          such action is necessary to:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>To comply with a legal obligation</li>
          <li>To protect and defend the rights or property of iTracksy</li>
          <li>
            To prevent or investigate possible wrongdoing in connection with the
            Service
          </li>
          <li>
            To protect the personal safety of users of the Service or the public
          </li>
          <li>To protect against legal liability</li>
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Security Of Data</h2>
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet, or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Service Providers</h2>
        <p>
          {`We may employ third party companies and individuals to facilitate our
          Service ("Service Providers"), to provide the Service on our behalf,
          to perform Service-related services or to assist us in analyzing how
          our Service is used.`}
        </p>
        <p className="mt-2">
          These third parties have access to your Personal Data only to perform
          these tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
