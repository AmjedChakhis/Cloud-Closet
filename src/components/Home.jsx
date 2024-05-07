import ButtonGradient from "../assets/svg/ButtonGradient";
import Benefits from "./Benefits"
import Footer from "./Footer";
import Header from "./Header";

import Hero from "./Hero";
import Pricing from "./Pricing";
import Services from "./Services";

const Home = () => {
  return (
    <>
        <Header />
        <Hero />
        <Benefits />
        <Services />
        <Pricing />
        <Footer />
      <ButtonGradient />
    </>
  );
};

export default Home;