import React from 'react';
import { useProjects } from '../../context/ProjectContext';
import Hero from '../../components/Hero';
import WhyUsSection from '../../components/WhyUsSection';
import RecentProject from '../../components/RecentProject';

const Home = () => {
    return (
        <div>
            <Hero />
            <WhyUsSection />
            <RecentProject />
        </div>
    );
};

export default Home;