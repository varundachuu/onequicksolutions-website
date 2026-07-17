import React from "react";
import HomeHero from "./HomeHero";
import WhyChooseUs from "./whyChooseUs";
import AboutUs from "./About";
import Services from "./services";
import ProductSpotlight from "./ProductSpotlight";
import Products from "./Products";
import Features from "./Features";
import Industries from "./Industries";
import Portfolio from "./Portfolio";
import OtherServices from "./Other-Services";
import Founders from "./Founders";
import ClientConfidence from "./ClientConfidence";
import FaqSection from "./FaqSection";
import ContactUs from "./contactUs";
import { faqItems } from "../../content/siteContent";

const scrollToDocumentSection = (sectionId) => {
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(sectionId);
  const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

  if (!target) {
    return;
  }

  const topPosition =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

function HomePage() {
  return (
    <>
      <HomeHero
        onExploreServices={() => scrollToDocumentSection("service")}
        onTalkToTeam={() => scrollToDocumentSection("contact")}
      />
      <WhyChooseUs />
      <AboutUs />
      <Services variant="home" />
      <ProductSpotlight />
      <Products />
      <Features />
      <Industries />
      <Portfolio onPrimaryCta={() => scrollToDocumentSection("contact")} />
      <OtherServices />
      <Founders />
      <ClientConfidence />
      <FaqSection items={faqItems} />
      <ContactUs />
    </>
  );
}

export default HomePage;
