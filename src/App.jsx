import React, { Suspense } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Hero from './components/Hero';
import Background from './components/Background';
import Navbar from './components/Navbar';

// Lazy load all below-fold sections — keeps the initial JS bundle small
// so FCP/LCP happen much sooner
const About = React.lazy(() => import('./components/About'));
const Skills = React.lazy(() => import('./components/Skills'));
const Experience = React.lazy(() => import('./components/Experience'));
const Projects = React.lazy(() => import('./components/Projects'));
const Contact = React.lazy(() => import('./components/Contact'));

function App() {
    return (
        <ReactLenis root>
            <div className="app-container relative selection:bg-[var(--accent-color)] selection:text-black">
                <Background />
                <Navbar />

                <Hero />

                <Suspense fallback={null}>
                    <About />
                    <Skills />
                    <Experience />
                    <Projects />
                    <Contact />
                </Suspense>
            </div>
        </ReactLenis>
    );
}

export default App;
