import React, { useState } from 'react';
import { Clock, Users, AlertCircle, ArrowRight, Check } from 'lucide-react';

export const OnboardingScreen = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Find Blood Faster',
      description:
        'Instantly scan nearby registered blood banks and partner hospitals with real-time verified inventories.',
      icon: Clock,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Connect With Verified Donors',
      description:
        'Smart proximity matching contacts eligible, compatible blood donors within your vicinity in seconds.',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Support Emergency Blood Requests',
      description:
        'Track requests from emergency creation to medical verification, donor acceptance, and confirmed transfusion.',
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800">
      {/* Top skip */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onFinish}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        <div className={`w-28 h-28 rounded-3xl ${slide.color} flex items-center justify-center mb-8 shadow-inner`}>
          <Icon className="w-14 h-14" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{slide.title}</h2>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs">{slide.description}</p>
      </div>

      {/* Footer & Controls */}
      <div className="pb-4 space-y-6">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-rose-600' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-98 transition"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          {currentSlide === slides.length - 1 ? (
            <Check className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
