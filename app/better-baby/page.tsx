import React from "react";
import HeroSection from "./_components/herosection";
import CategoriesSection from "./_components/categoriessection";
import PromoSection from "./_components/promosection";
import Promotion from "./_components/promotional";
import BrandStory from "./_components/brandstory";
import Testimonials from "./_components/testimonials";
import FeaturedProducts from "./_components/featuredproducts";

function page() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <PromoSection />
      <Promotion />
      {/* <BrandStory /> */}
      <FeaturedProducts />
      <Testimonials />
    </>
  );
}

export default page;
