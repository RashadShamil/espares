'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ParallaxBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const windowWidth = window.innerWidth / 2;
            const windowHeight = window.innerHeight / 2;

            // Divide by 60 for a smooth, subtle movement
            const mouseX = (event.clientX - windowWidth) / 60;
            const mouseY = (event.clientY - windowHeight) / 60;

            setMousePos({ x: mouseX, y: mouseY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        // pointer-events-none ensures this background doesn't block any clicks on your website
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
                // Increased opacity to 40% and added mix-blend-multiply so it shows up perfectly on gray
                className="absolute inset-[-50px] w-[calc(100%+100px)] h-[calc(100%+100px)] opacity-100 mix-blend-multiply"
                style={{
                    transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <Image
                    src="/parallax.jpg" // Make sure this image is in your public folder
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}