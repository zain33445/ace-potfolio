import ContactRequest from '../../../components/ContactRequest';
import Footer from '../../../components/Footer';

export default function ContactSection() {
  return (
    <div id="contact" className="bg-background border-b border-blueprint-line relative">
      <ContactRequest />
      <div className="mt-20 px-6 md:px-16">
        <Footer />
      </div>
    </div>
  );
}
