import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

const ProductTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      showDemoElements();
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      hideDemoElements();
    }

    return () => {
      document.body.style.overflow = 'unset';
      hideDemoElements();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isVisible) {
      setTimeout(() => {
        showDemoElements();
      }, 100);
    }
  }, [currentStep, isOpen, isVisible]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishTour = () => {
    localStorage.setItem('merkuTourCompleted', 'true');
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const skipTour = () => {
    localStorage.setItem('merkuTourCompleted', 'true');
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const showDemoElements = () => {
    // Reset all demo elements first
    hideDemoElements();
    
    // Show store filter for step 3 (index 2)
    if (currentStep === 2) {
      const storeFilterEl = document.getElementById('store-filter');
      if (storeFilterEl) {
        storeFilterEl.style.visibility = 'visible';
        storeFilterEl.style.height = 'auto';
      }
      
      const demoFilter = document.getElementById('tour-demo-store-filter');
      if (demoFilter) {
        demoFilter.style.display = 'block';
      }
    }

    // Show demo results for step 4 (index 3)
    if (currentStep === 3) {
      const demoResults = document.getElementById('tour-demo-results');
      if (demoResults) {
        demoResults.style.display = 'block';
      }
    }
  };

  const hideDemoElements = () => {
    const storeFilter = document.getElementById('tour-demo-store-filter');
    const demoResults = document.getElementById('tour-demo-results');
    const storeFilterEl = document.getElementById('store-filter');
    
    if (storeFilter) storeFilter.style.display = 'none';
    if (demoResults) demoResults.style.display = 'none';
    if (storeFilterEl) {
      storeFilterEl.style.visibility = '';
      storeFilterEl.style.height = '';
    }
  };

  const getTargetElement = () => {
    if (!currentTourStep.target) return null;
    
    let element = document.getElementById(currentTourStep.target);
    
    // Special handling for store filter
    if (!element && currentTourStep.target === 'store-filter') {
      const storeFilterEl = document.getElementById('store-filter');
      if (storeFilterEl) {
        storeFilterEl.style.visibility = 'visible';
        storeFilterEl.style.height = 'auto';
        element = storeFilterEl;
      }
    }
    
    return element;
  };

  const getTargetPosition = () => {
    const element = getTargetElement();
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

  const getTooltipPosition = () => {
    const targetPos = getTargetPosition();
    const tooltipWidth = currentStep === 0 || currentStep === 5 ? 420 : 320;
    const tooltipHeight = 200;
    const padding = 20;
    const arrowSize = 12;

    if (!targetPos || currentTourStep.position === 'center') {
      return {
        tooltipStyle: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: tooltipWidth,
          zIndex: 1002
        },
        arrowStyle: null,
        highlightStyle: null
      };
    }

    let tooltipTop, tooltipLeft, tooltipTransform = '';
    let arrowTop, arrowLeft, arrowTransform = '';
    let arrowClass = '';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    switch (currentTourStep.position) {
      case 'bottom':
        tooltipTop = Math.min(targetPos.bottom + padding + arrowSize, viewportHeight - tooltipHeight - 20);
        tooltipLeft = Math.max(20, Math.min(targetPos.left + (targetPos.width / 2), viewportWidth - tooltipWidth - 20));
        tooltipTransform = 'translateX(-50%)';
        
        arrowTop = targetPos.bottom + padding;
        arrowLeft = targetPos.left + (targetPos.width / 2);
        arrowTransform = 'translateX(-50%)';
        arrowClass = 'arrow-top';
        break;
        
      case 'top':
        tooltipTop = Math.max(20, targetPos.top - tooltipHeight - padding - arrowSize);
        tooltipLeft = Math.max(20, Math.min(targetPos.left + (targetPos.width / 2), viewportWidth - tooltipWidth - 20));
        tooltipTransform = 'translateX(-50%)';
        
        arrowTop = targetPos.top - padding - arrowSize;
        arrowLeft = targetPos.left + (targetPos.width / 2);
        arrowTransform = 'translateX(-50%)';
        arrowClass = 'arrow-bottom';
        break;
        
      case 'left':
        tooltipTop = Math.max(20, Math.min(targetPos.top + (targetPos.height / 2), viewportHeight - tooltipHeight - 20));
        tooltipLeft = Math.max(20, targetPos.left - tooltipWidth - padding - arrowSize);
        tooltipTransform = 'translateY(-50%)';
        
        arrowTop = targetPos.top + (targetPos.height / 2);
        arrowLeft = targetPos.left - padding;
        arrowTransform = 'translateY(-50%)';
        arrowClass = 'arrow-right';
        break;
        
      case 'right':
        tooltipTop = Math.max(20, Math.min(targetPos.top + (targetPos.height / 2), viewportHeight - tooltipHeight - 20));
        tooltipLeft = Math.min(targetPos.right + padding + arrowSize, viewportWidth - tooltipWidth - 20);
        tooltipTransform = 'translateY(-50%)';
        
        arrowTop = targetPos.top + (targetPos.height / 2);
        arrowLeft = targetPos.right + padding;
        arrowTransform = 'translateY(-50%)';
        arrowClass = 'arrow-left';
        break;
    }

    return {
      tooltipStyle: {
        position: 'fixed',
        top: tooltipTop,
        left: tooltipLeft,
        transform: tooltipTransform,
        width: tooltipWidth,
        zIndex: 1002
      },
      arrowStyle: {
        position: 'fixed',
        top: arrowTop,
        left: arrowLeft,
        transform: arrowTransform,
        zIndex: 1001
      },
      arrowClass,
      highlightStyle: {
        position: 'fixed',
        top: targetPos.top - 4,
        left: targetPos.left - 4,
        width: targetPos.width + 8,
        height: targetPos.height + 8,
        zIndex: 1000
      }
    };
  };

  if (!isOpen || !isVisible) return null;

  const { tooltipStyle, arrowStyle, arrowClass, highlightStyle } = getTooltipPosition();

  return (
    <>
      {/* Tour Styles */}
      <style jsx>{`
        .tour-overlay {
          position: fixed;
          inset: 0;
          background: transparent;
          backdrop-filter: blur(4px);
          z-index: 999;
        }
        
        .tour-tooltip {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .tour-arrow {
          width: 0;
          height: 0;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .arrow-top {
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 12px solid white;
        }
        
        .arrow-bottom {
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid white;
        }
        
        .arrow-left {
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          border-right: 12px solid white;
        }
        
        .arrow-right {
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
          border-left: 12px solid white;
        }
        
        .tour-highlight {
          border: 3px solid #f7941d;
          border-radius: 8px;
          box-shadow: 0 0 0 4px rgba(247, 148, 29, 0.2);
          pointer-events: none;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: none;
        }

        .tour-step-indicator {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .tour-step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .tour-step-dot.active {
          background-color: #f7941d;
        }
        
        .tour-step-dot.inactive {
          background-color: #d3d4d7;
        }
        
        .tour-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tour-btn-primary {
          background-color: #f7941d;
          color: white;
        }
        
        .tour-btn-primary:hover {
          background-color: black;
        }
        
        .tour-btn-secondary {
          background-color: transparent;
          color: #c2bfbf;
          border: 1px solid #e5e7eb;
        }
        
        .tour-btn-secondary:hover {
          color: #f7941d;
          background-color: #f3f4f6;
        }
        
        .tour-btn-secondary:disabled {
          color: #d3d4d7;
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .tour-btn-secondary:disabled:hover {
          color: #d3d4d7;
          background-color: transparent;
        }
      `}</style>

      {/* Overlay - only blur, no darkening */}
      <div className="tour-overlay" />
      
      {/* Target highlight */}
      {highlightStyle && (
        <div 
          className="tour-highlight" 
          style={highlightStyle}
        />
      )}
      
      {/* Arrow */}
      {arrowStyle && arrowClass && (
        <div 
          className={`tour-arrow ${arrowClass}`}
          style={arrowStyle}
        />
      )}
      
      {/* Tooltip */}
      <div 
        className="tour-tooltip"
        style={tooltipStyle}
      >
        <div style={{ padding: '24px' }}>
          {/* Close button */}
          <button
            onClick={skipTour}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: '#c2bfbf',
              cursor: 'pointer',
              padding: '4px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#f7941d'}
            onMouseLeave={(e) => e.target.style.color = '#c2bfbf'}
          >
            <X size={20} />
          </button>
          
          {/* Step indicator */}
          <div style={{ marginBottom: '16px' }}>
            <div className="tour-step-indicator">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`tour-step-dot ${index <= currentStep ? 'active' : 'inactive'}`}
                />
              ))}
            </div>
            <span style={{ fontSize: '14px', color: '#c2bfbf' }}>
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          
          {/* Content */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '12px',
              lineHeight: '1.3'
            }}>
              {currentTourStep.title}
            </h3>
            <p style={{ 
              color: '#c2bfbf', 
              lineHeight: '1.5',
              margin: 0
            }}>
              {currentTourStep.text}
            </p>
          </div>
          
          {/* Navigation buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="tour-btn tour-btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            
            {currentStep === tourSteps.length - 1 ? (
              <button
                onClick={finishTour}
                className="tour-btn tour-btn-primary"
              >
                Finish
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="tour-btn tour-btn-primary"
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
          
          {/* Skip tour link */}
          {currentStep < tourSteps.length - 1 && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                onClick={skipTour}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '14px',
                  color: '#c2bfbf',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#f7941d'}
                onMouseLeave={(e) => e.target.style.color = '#c2bfbf'}
              >
                Skip tour
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Elements */}
      
      {/* Demo Store Filter */}
      <div 
        id="tour-demo-store-filter" 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 40,
          display: 'none'
        }}
      >
        <div style={{
          background: '#f3f4f6',
          borderRadius: '12px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontSize: '14px', color: '#c2bfbf' }}>Stores:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Amazon', 'Temu', 'AliExpress', 'eBay'].map((store) => (
              <span 
                key={store} 
                style={{
                  background: '#f7941d',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {store}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Results */}
      <div 
        id="tour-demo-results" 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 40,
          display: 'none'
        }}
      >
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          maxWidth: '400px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '12px', 
            color: '#1f2937' 
          }}>
            Search Results
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px' 
          }}>
            {[
              { name: 'Wireless Earbuds', price: '$79.99', store: 'Amazon' },
              { name: 'Bluetooth Headphones', price: '$95.00', store: 'eBay' },
              { name: 'Gaming Headset', price: '$65.99', store: 'Temu' },
              { name: 'Noise Cancelling', price: '$120.00', store: 'AliExpress' }
            ].map((product, index) => (
              <div key={index} style={{
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{product.name}</div>
                <div style={{ color: '#f7941d', fontWeight: '600' }}>{product.price}</div>
                <div style={{ color: '#c2bfbf', fontSize: '12px' }}>{product.store}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTour;