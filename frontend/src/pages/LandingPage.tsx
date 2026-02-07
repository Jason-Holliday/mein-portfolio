import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AboutSection from "../sections/AboutSection";
import HeroSection from "../sections/HeroSection";
import ProjectSection from "../sections/ProjectsSection";
import TechStackSection from "../sections/TechStackSection";


const LandingPage = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ProjectSection />
        <Footer />
    </div>
  );
};

export default LandingPage;
