import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Background from './components/Background';
import Navbar from './components/Navbar';


function App() {
    return (
        <ReactLenis root>
            <div className="app-container relative selection:bg-[var(--accent-color)] selection:text-black">
                <Background />
                <Navbar />


                <Hero />
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Contact />
            </div>
        </ReactLenis>
    );
}

export default App;
