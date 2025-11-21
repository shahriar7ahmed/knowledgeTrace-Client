import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import WhyUsSection from '../../components/whyUsSection';
import RecentProject from '../../components/RecentProject';
import Footer from '../../components/Footer';

const Home = () => {
    return (
        <div>
           <Navbar></Navbar>
           <Hero></Hero>
           <WhyUsSection></WhyUsSection>
           <RecentProject></RecentProject>
           <Footer></Footer>
        </div>
    );
};

export default Home;