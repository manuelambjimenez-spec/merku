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
      position: 'right'
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

  // Show demo elements for specific steps
  const showDemoElements = () => {
    // Show store filter for step 3
    if (currentStep === 2) {
      const storeFilter = document.getElementById('tour-demo-store-filter');
      if (storeFilter) storeFilter.style.display = 'block';
    } else {
      const storeFilter = document.getElementById('tour-demo-store-filter');
      if (storeFilter) storeFilter.style.display = 'none';
    }

    // Show demo results for step 4
    if (currentStep === 3) {
      const demoResults = document.getElementById('tour-demo-results');
      if (demoResults) demoResults.style.display = 'block';
    } else {
      const demoResults = document.getElementById('tour-demo-results');
      if (demoResults) demoResults.style.display = 'none';
    }
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

  // Calculate tooltip position with arrow
  const getTooltipPosition = () => {
    const tooltipWidth = currentStep === 0 || currentStep === 5 ? 420 : 320;
    const tooltipHeight = currentStep === 0 || currentStep === 5 ? 180 : 200;
    const padding = 20;
    const arrowSize = 12;

    if (!targetPos) {
      return {
        style: {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: tooltipWidth
        },
        arrowStyle: { display: 'none' }
      };
    }

    let top, left, transform = '';
    let arrowTop, arrowLeft, arrowTransform = '';
    let arrowBorder = '';

    switch (currentTourStep.position) {
      case 'bottom':
        top = targetPos.bottom + padding + arrowSize;
        left = targetPos.left + (targetPos.width / 2);
        transform = 'translateX(-50%)';
        
        arrowTop = targetPos.bottom + padding;
        arrowLeft = targetPos.left + (targetPos.width / 2);
        arrowTransform = 'translateX(-50%)';
        arrowBorder = 'border-bottom: 12px solid white; border-left: 12px solid transparent; border-right: 12px solid transparent;';
        break;
        
      case 'top':
        top = targetPos.top - tooltipHeight - padding - arrowSize;
        left = targetPos.left + (targetPos.width / 2);
        transform = 'translateX(-50%)';
        
        arrowTop = targetPos.top - padding - arrowSize;
        arrowLeft = targetPos.left + (targetPos.width / 2);
        arrowTransform = 'translateX(-50%)';
        arrowBorder = 'border-top: 12px solid white; border-left: 12px solid transparent; border-right: 12px solid transparent;';
        break;
        
      case 'left':
        top = targetPos.top + (targetPos.height / 2);
        left = targetPos.left - tooltipWidth - padding - arrowSize;
        transform = 'translateY(-50%)';
        
        arrowTop = targetPos.top + (targetPos.height / 2);
        arrowLeft = targetPos.left - padding - arrowSize;
        arrowTransform = 'translateY(-50%)';
        arrowBorder = 'border-left: 12px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent;';
        break;
        
      case 'right':
        top = targetPos.top + (targetPos.height / 2);
        left = targetPos.right + padding + arrowSize;
        transform = 'translateY(-50%)';
        
        arrowTop = targetPos.top + (targetPos.height / 2);
        arrowLeft = targetPos.right + padding;
        arrowTransform = 'translateY(-50%)';
        arrowBorder = 'border-right: 12px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent;';
        break;
        
      default:
        top = '50%';
        left = '50%';
        transform = 'translate(-50%, -50%)';
        arrowBorder = 'display: none;';
    }

    return {
      style: { top, left, transform, width: tooltipWidth },
      arrowStyle: {
        position: 'absolute',
        top: arrowTop,
        left: arrowLeft,
        transform: arrowTransform,
        width: 0,
        height: 0,
        zIndex: 1002,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        style: arrowBorder
      }
    };
  };

  const { style: tooltipStyle, arrowStyle } = getTooltipPosition();

  // Highlight style for target element
  const getHighlightStyle = () => {
    if (!targetPos) return {};
    
    return {
      position: 'absolute',
      top: targetPos.top - 4,
      left: targetPos.left - 4,
      width: targetPos.width + 8,
      height: targetPos.height + 8,
      border: '3px solid #f7941d',
      borderRadius: '8px',
      boxShadow: '0 0 0 4px rgba(247, 148, 29, 0.2)',
      pointerEvents: 'none',
      zIndex: 1001
    };
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      showDemoElements();
    } else {
      document.body.style.overflow = 'unset';
      // Hide all demo elements
      const storeFilter = document.getElementById('tour-demo-store-filter');
      const demoResults = document.getElementById('tour-demo-results');
      if (storeFilter) storeFilter.style.display = 'none';
      if (demoResults) demoResults.style.display = 'none';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentStep]);

  useEffect(() => {
    showDemoElements();
  }, [currentStep]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50">
        {/* Backdrop with blur effect only (no dark overlay) */}
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        />
        
        {/* Highlight for target element */}
        {targetPos && (
          <div style={getHighlightStyle()} />
        )}
        
        {/* Arrow */}
        {targetPos && arrowStyle.style !== 'display: none;' && (
          <div
            style={{
              position: 'absolute',
              top: arrowStyle.top,
              left: arrowStyle.left,
              transform: arrowStyle.transform,
              width: 0,
              height: 0,
              zIndex: 1002,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            <div style={{ ...arrowStyle.style }} />
          </div>
        )}
        
        {/* Tour tooltip - balloon style */}
        <div
          className="absolute bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
          style={{
            ...tooltipStyle,
            maxWidth: tooltipStyle.width,
            minHeight: currentStep === 0 || currentStep === 5 ? '160px' : '180px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            zIndex: 1002
          }}
        >
          {/* Close button */}
          <button
            onClick={skipTour}
            className="absolute top-4 right-4 text-[#c2bfbf] hover:text-[#f7941d] transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* Step indicator */}
          <div className="mb-4">
            <div className="flex space-x-2 mb-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-[#f7941d]' : 'bg-[#d3d4d7]'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[#c2bfbf]">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {currentTourStep.title}
            </h3>
            <p className="text-[#c2bfbf] leading-relaxed">
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
                  ? 'text-[#d3d4d7] cursor-not-allowed'
                  : 'text-[#c2bfbf] hover:text-[#f7941d] hover:bg-[#f3f4f6]'
              }`}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            
            {currentStep === tourSteps.length - 1 ? (
              <button
                onClick={finishTour}
                className="bg-[#f7941d] text-white px-6 py-2 rounded-lg hover:bg-black transition-colors font-medium"
              >
                Finish
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-[#f7941d] text-white px-6 py-2 rounded-lg hover:bg-black transition-colors font-medium"
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
                className="text-sm text-[#c2bfbf] hover:text-[#f7941d] underline transition-colors"
              >
                Skip tour
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Elements */}
      
      {/* Demo Store Filter - shown only during step 3 */}
      <div 
        id="tour-demo-store-filter" 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
        style={{ display: 'none' }}
      >
        <div className="bg-[#f3f4f6] rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <span className="text-sm text-[#c2bfbf]">Stores:</span>
          <div className="flex gap-2">
            {['Amazon', 'Temu', 'AliExpress', 'eBay'].map((store) => (
              <span key={store} className="bg-[#f7941d] text-white px-2 py-1 rounded text-xs">
                {store}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Results - shown only during step 4 */}
      <div 
        id="tour-demo-results" 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
        style={{ display: 'none' }}
      >
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Search Results</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Wireless Earbuds', price: '$79.99', store: 'Amazon' },
              { name: 'Bluetooth Headphones', price: '$95.00', store: 'eBay' },
              { name: 'Gaming Headset', price: '$65.99', store: 'Temu' },
              { name: 'Noise Cancelling', price: '$120.00', store: 'AliExpress' }
            ].map((product, index) => (
              <div key={index} className="bg-[#f3f4f6] rounded p-2 text-sm">
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-[#f7941d] font-semibold">{product.price}</div>
                <div className="text-[#c2bfbf] text-xs">{product.store}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTour;