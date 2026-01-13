import React, { useEffect, useState } from 'react';
import img1 from '../assets/image1.avif';
import img2 from '../assets/image2.avif';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate

const HomeSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate(); // ✅ initialize navigate

    const slides = [
        {
            id: 1,
            image: img1,
            title: "Premium Audio Experience",
            description: "Immerse yourself in crystal clear sound"
        },
        {
            id: 2,
            image: img2,
            title: "Luxury Sound Solutions",
            description: "Experience audio like never before"
        }
    ];

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        const slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [currentIndex]);

    return (
        <div className="relative w-full h-[500px] overflow-hidden group">
            {/* Background Image */}
            <div
                className="w-full h-full bg-cover bg-center transition-transform duration-[1500ms] scale-105"
                style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30">
                    {/* Content */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-3xl px-4 text-white">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg animate-fadeIn">
                            {slides[currentIndex].title}
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-200 mb-8 animate-fadeIn delay-150">
                            {slides[currentIndex].description}
                        </p>

                        {/* ✅ Updated button with navigation */}
                        <button
                            onClick={() => navigate("/products")}
                            className="px-10 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
                        >
                            Shop Collection
                        </button>
                    </div>
                </div>
            </div>

            {/* Left Arrow */}
            <div className="hidden group-hover:flex absolute top-1/2 left-6 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white cursor-pointer hover:scale-110 transition">
                <BsChevronCompactLeft onClick={prevSlide} size={26} />
            </div>

            {/* Right Arrow */}
            <div className="hidden group-hover:flex absolute top-1/2 right-6 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white cursor-pointer hover:scale-110 transition">
                <BsChevronCompactRight onClick={nextSlide} size={26} />
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-white w-10'
                                : 'bg-white/40 w-3 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeSlider;
