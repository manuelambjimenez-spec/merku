import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

const ProductTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Hi there! Welcome to Merku 👋',
      text: 'Merku is your intelligent AI shopping assistant, helping you instantly find the right product for your needs. Let\'s take a quick tour!',
      target: null,
      position: 'center'
    },
    {
      id: 'search-bar',
      title: 'Search anything',
      text: 'Type what you\'re looking for (e.g. "wireless earbuds under $100" or "size 40 jeans"), and Merku will find the best options for you.',
      target: 'search-input',
      position: 'bottom'
    },
    {
      id: 'store-filter',
      title: 'Choose your stores',
      text: 'Filter results by store — Amazon, Temu, AliExpress, or eBay. You\'re always in control.',
      target: 'store-filter',
      position: 'bottom'
    },
    {
      id: 'results',
      title: 'Smart results',
      text: 'Merku gives you tailored product recommendations based on your filters.',
      target: 'results-section',
      position: 'top'
    },
    {
      id: 'profile',
      title: 'Save your sizes',
      text: 'Set your clothing size, shoe size, and gender to make your results even more personal.',
      target: 'user-profile',
      position: 'left'
    },
    {
      id: 'finish',
      title: 'All set!',
      text: 'You\'re ready to explore Merku. Enjoy your personalized shopping experience!',
      target: null,
      position: 'center'
    }
  ];

  const currentTourStep = tourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishTour = () => {
    localStorage.setItem('merkuTourCompleted', 'true');
    onClose();
  };

  const skipTour = () => {
    localStorage.setItem('merkuTourCompleted', 'true');
    onClose();
  };

  // Get target element position
  const getTargetPosition = () => {
    if (!currentTourStep.target) return null;
    
    const element = document.getElementById(currentTourStep.target);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom
    };
  };

  const targetPos = getTargetPosition();

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetPos) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 20;

    let top, left, transform = '';

    switch (currentTourStep.position) {
      case 'bottom':
        top = targetPos.bottom + padding;
        left = targetPos.left + (targetPos.width / 2);
        transform = 'translateX(-50%)';
        break;
      case 'top':
        top = targetPos.top - tooltipHeight - padding;
        left = targetPos.left + (targetPos.width / 2);
        transform = 'translateX(-50%)';
        break;
      case 'left':
        top = targetPos.top + (targetPos.height / 2);
        left = targetPos.left - tooltipWidth - padding;
        transform = 'translateY(-50%)';
        break;
      case 'right':
        top = targetPos.top + (targetPos.height / 2);
        left = targetPos.right + padding;
        transform = 'translateY(-50%)';
        break;
      default:
        top = '50%';
        left = '50%';
        transform = 'translate(-50%, -50%)';
    }

    return { top, left, transform };
  };

  const tooltipStyle = getTooltipPosition();

  // Highlight style for target element
  const getHighlightStyle = () => {
    if (!targetPos) return {};
    
    return {
      position: 'absolute',
      top: targetPos.top - 4,
      left: targetPos.left - 4,
      width: targetPos.width + 8,
      height: targetPos.height + 8,
      border: '2px solid #3B82F6',
      borderRadius: '8px',
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)',
      pointerEvents: 'none',
      zIndex: 1001
    };
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Highlight for target element */}
      {targetPos && (
        <div style={getHighlightStyle()} />
      )}
      
      {/* Tour tooltip */}
      <div
        className="absolute bg-white rounded-lg shadow-2xl p-6 w-80 max-w-sm border border-gray-200"
        style={tooltipStyle}
      >
        {/* Close button */}
        <button
          onClick={skipTour}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Step indicator */}
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {tourSteps.length}
          </span>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {currentTourStep.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {currentTourStep.text}
          </p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          {currentStep === tourSteps.length - 1 ? (
            <button
              onClick={finishTour}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
        
        {/* Skip tour link */}
        {currentStep < tourSteps.length - 1 && (
          <div className="mt-4 text-center">
            <button
              onClick={skipTour}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTour;