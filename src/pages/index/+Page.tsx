import BackgroundShader from '../../components/BackgroundShader'
import HeroSection from '../Home/sections/HeroSection'
import StatsSection from '../Home/sections/StatsSection'
import AboutSection from '../Home/sections/AboutSection'
import SolutionsSection from '../Home/sections/SolutionsSection'
import WhyChooseUsSection from '../Home/sections/WhyChooseUsSection'
import TestimonialsSection from '../Home/sections/TestimonialsSection'
import CalculatorSection from '../Home/sections/CalculatorSection'
import ProjectsSection from '../Home/sections/ProjectsSection'
import ProcessSection from '../Home/sections/ProcessSection'
import ContactSection from '../Home/sections/ContactSection'
import { usePreloader } from '../../PreloaderContext'

export { Page }

function Page() {
  const { preloaderDone } = usePreloader()

  return (
    <>
      <BackgroundShader />
      <HeroSection preloaderDone={preloaderDone} />
      <StatsSection />
      <AboutSection />
      <SolutionsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CalculatorSection />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
    </>
  )
}
