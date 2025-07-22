/**
 * Production-Ready Animation Initializer
 * Ensures animations load properly in WeWeb production environment
 */

(function() {
    'use strict';
    
    // Configuration
    const CALENDAR_URL = 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true';
    const ANIMATION_DELAY = 100; // ms to wait for DOM stability
    
    // Track initialization
    let isInitialized = false;
    let animationSystem = null;
    
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }
    
    function initializeCalendarLinks() {
        // Update all calendar-related elements with production URL
        const calendarSelectors = [
            '[data-lucide="calendar"]',
            '.lucide-calendar',
            '[data-ww-name*="Calendar"]',
            '[data-ww-name*="calendar"]',
            '.ww-button:contains("découverte")',
            '.ww-button:contains("rendez-vous")',
            '.ww-button:contains("contact")'
        ];
        
        calendarSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.cursor = 'pointer';
                    element.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.open(CALENDAR_URL, '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
                    });
                    
                    // Add visual feedback
                    element.addEventListener('mouseenter', () => {
                        element.style.transform = 'scale(1.05)';
                        element.style.transition = 'transform 0.2s ease';
                    });
                    
                    element.addEventListener('mouseleave', () => {
                        element.style.transform = 'scale(1)';
                    });
                });
            } catch (error) {
                console.warn(`Could not process calendar selector: ${selector}`, error);
            }
        });
        
        // Also handle text-based matching for buttons
        const buttons = document.querySelectorAll('.ww-button, [role="button"], button');
        buttons.forEach(button => {
            const text = button.textContent.toLowerCase();
            if (text.includes('découverte') || text.includes('rendez-vous') || text.includes('réserver') || text.includes('contact')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(CALENDAR_URL, '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
                });
            }
        });
    }
    
    function initializeAnimations() {
        // Initialize premium animations if the class exists
        if (typeof PremiumScrollAnimations !== 'undefined') {
            try {
                animationSystem = new PremiumScrollAnimations();
                console.log('Premium animations initialized successfully');
            } catch (error) {
                console.error('Error initializing animations:', error);
            }
        } else {
            console.warn('PremiumScrollAnimations class not found, animations will not be applied');
        }
    }
    
    function addProductionOptimizations() {
        // Add performance optimizations for production
        
        // Preload critical resources
        const preloadLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@700&display=swap'
        ];
        
        preloadLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
        
        // Add smooth scrolling behavior
        if (!document.documentElement.style.scrollBehavior) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
        
        // Optimize images for faster loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            if (!img.decoding) {
                img.decoding = 'async';
            }
        });
    }
    
    function initializeProduction() {
        if (isInitialized) return;
        
        try {
            console.log('Initializing TeachInspire production enhancements...');
            
            // Initialize calendar functionality
            initializeCalendarLinks();
            
            // Initialize animations after a short delay
            setTimeout(() => {
                initializeAnimations();
            }, ANIMATION_DELAY);
            
            // Add production optimizations
            addProductionOptimizations();
            
            isInitialized = true;
            console.log('TeachInspire production initialization complete');
            
            // Dispatch custom event for other scripts that might be listening
            document.dispatchEvent(new CustomEvent('teachinspire:ready', {
                detail: { animationSystem, calendarUrl: CALENDAR_URL }
            }));
            
        } catch (error) {
            console.error('Error during production initialization:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProduction);
    } else {
        // DOM is already ready
        initializeProduction();
    }
    
    // Also try to initialize after a short delay in case of dynamic content
    setTimeout(initializeProduction, 1000);
    
    // Re-initialize on navigation (for SPA-like behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            isInitialized = false;
            setTimeout(initializeProduction, 500);
        }
    }).observe(document, { subtree: true, childList: true });
    
    // Export for debugging
    window.TeachInspireProduction = {
        reinitialize: () => {
            isInitialized = false;
            initializeProduction();
        },
        getAnimationSystem: () => animationSystem,
        getCalendarUrl: () => CALENDAR_URL
    };
    
})();