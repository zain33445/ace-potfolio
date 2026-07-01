import Section from '../../../components/Section';
import Reveal from '../../../components/Reveal';
import ContactRequest from '../../../components/ContactRequest';
import Footer from '../../../components/Footer';

export default function ContactSection() {
  return (
    <Section sectionId="contact" className="py-20 px-6 md:px-16 bg-background border-b border-blueprint-line relative overflow-y-auto">
      <Reveal type="fadeUp">
        <div className="container mx-auto max-w-5xl">
          <ContactRequest />
        </div>
      </Reveal>
      <div className="mt-20">
        <Footer />
      </div>
    </Section>
  );
}
