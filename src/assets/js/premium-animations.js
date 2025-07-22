/**
 * Premium Scroll-Triggered Animations
 * Handles revealing content as user scrolls through the page
 */

class PremiumScrollAnimations {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.findAnimatableElements();
        this.observeElements();
        this.addInitialAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px', // Trigger when 10% into viewport
            threshold: [0.1, 0.3, 0.5]
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                }
            });
        }, options);
    }

    findAnimatableElements() {
        // Target specific WeWeb sections by their UIDs and structure
        const weBebSections = document.querySelectorAll(
            '[data-ww-name*="Section"], .ww-section, section, [data-section-id], ' +
            '[data-ww-uid="1b0b31e0-8a1d-4c98-9562-2a7bffd7b340"], ' + // Problem Section
            '[data-ww-uid="7e236026-ae26-43c1-b165-0a64b12a6d75"], ' + // Solution Section  
            '[data-ww-uid="a823c108-9097-4a2a-a8cd-8505c1ef1cc9"], ' + // About Section
            '[data-ww-uid="eeca3349-b596-4f42-8363-38d479ae30ba"], ' + // Training Section
            '[data-ww-uid="c7ba5dc1-c233-4dd9-bcdb-39a1d7642e7e"], ' + // Community Section
            '[data-ww-uid="1fb36b5f-587e-46f8-8fd2-f32ec4a7913c"], ' + // Guarantees Section
            '[data-ww-uid="2225af1a-6129-4282-9fbe-35e98a57ccee"], ' + // Format Section
            '[data-ww-uid="71aef82d-8d34-45b3-bdf7-1310e073766c"], ' + // Pricing Section
            '[data-ww-uid="33abbee2-21ea-439c-afe7-322d23c08713"]'     // CTA Section
        );
        
        // WeWeb text elements
        const textElements = document.querySelectorAll(
            '.ww-text, .ww-heading, [data-ww-name*="Text"], [data-ww-name*="Heading"], ' +
            'h1, h2, h3, h4, p, [data-ww-component="text"]'
        );
        
        // WeWeb image elements
        const imageElements = document.querySelectorAll(
            'img, .ww-image, [data-ww-name*="Image"], [data-ww-component="image"], ' +
            '.ww-background-image, [data-ww-name*="Picture"]'
        );
        
        // WeWeb interactive elements
        const interactiveElements = document.querySelectorAll(
            '.ww-button, [data-ww-component="button"], [data-ww-name*="Button"], ' +
            '.ww-card, [data-ww-name*="Card"], [role="button"]'
        );

        // Apply animations based on section and content type
        weBebSections.forEach((section, index) => {
            const sectionName = section.getAttribute('data-ww-name') || section.tagName;
            
            // Skip hero section (handled separately)
            if (section.getAttribute('data-ww-uid') === 'ac0b1e8c-2363-41b1-9daa-49d580bb8c6f') {
                return;
            }
            
            section.classList.add('scroll-reveal');
            
            // Alternate slide directions for visual variety
            if (index % 2 === 0) {
                section.classList.add('scroll-reveal-left');
            } else {
                section.classList.add('scroll-reveal-right');
            }
        });

        // Apply text animations with staggered delays
        textElements.forEach((text, index) => {
            // Skip hero text (handled separately)
            if (text.closest('[data-ww-uid="ac0b1e8c-2363-41b1-9daa-49d580bb8c6f"]')) {
                return;
            }
            
            text.classList.add('scroll-reveal');
            text.classList.add(`stagger-${Math.min(index % 6 + 1, 6)}`);
        });

        // Apply image animations with variety
        imageElements.forEach((img, index) => {
            if (img.closest('[data-ww-uid="ac0b1e8c-2363-41b1-9daa-49d580bb8c6f"]')) {
                return;
            }
            
            img.classList.add('scroll-reveal');
            
            // Vary animation types for visual interest
            const animationType = index % 3;
            if (animationType === 0) {
                img.classList.add('premium-parallax-reveal');
            } else if (animationType === 1) {
                img.classList.add('premium-clip-reveal');
            } else {
                img.classList.add('premium-focus-reveal');
            }
            
            img.classList.add(`premium-image-delay-${Math.min(index % 3 + 1, 3)}`);
        });

        // Store all elements for observation
        this.elements = [
            ...Array.from(weBebSections),
            ...Array.from(textElements),
            ...Array.from(imageElements),
            ...Array.from(interactiveElements)
        ].filter(el => el.classList.contains('scroll-reveal') || 
                      el.classList.contains('scroll-reveal-left') || 
                      el.classList.contains('scroll-reveal-right'));
    }

    observeElements() {
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    revealElement(element) {
        // Add revealed class with slight delay for smoother effect
        setTimeout(() => {
            element.classList.add('revealed');
        }, 50);

        // Stop observing once revealed
        this.observer.unobserve(element);
    }

    addInitialAnimations() {
        // Target WeWeb hero section specifically
        const heroSection = document.querySelector('[data-ww-uid="ac0b1e8c-2363-41b1-9daa-49d580bb8c6f"]');
        if (heroSection) {
            heroSection.classList.add('premium-hero-section');
            
            // Add word-by-word reveal to hero text
            this.setupWordReveal(heroSection);
        }

        // Add floating animation to the hourglass image in hero
        const hourglassImage = document.querySelector('[data-name*="Hourglass"], img[src*="513fa36c"], [data-ww-name*="Hourglass"]');
        if (hourglassImage) {
            hourglassImage.classList.add('premium-float');
        }

        // Add glow pulse to CTA buttons (pricing and CTA sections)
        const ctaButtons = document.querySelectorAll(
            '[data-ww-uid="71aef82d-8d34-45b3-bdf7-1310e073766c"] .ww-button, ' + // Pricing CTA
            '[data-ww-uid="33abbee2-21ea-439c-afe7-322d23c08713"] .ww-button, ' + // CTA Section
            '.ww-button[style*="f1d263"], [data-ww-name*="CTA"]'
        );
        ctaButtons.forEach(button => {
            button.classList.add('premium-glow-pulse');
            // Add calendar click handler
            this.addCalendarIntegration(button);
        });

        // Add elegant hover effects to all WeWeb interactive elements
        const interactiveElements = document.querySelectorAll(
            '.ww-button, [data-ww-component="button"], .ww-card, [role="button"], ' +
            '[data-ww-name*="Button"], [data-ww-name*="Card"]'
        );
        interactiveElements.forEach(element => {
            element.classList.add('premium-hover-elegant');
        });

        // Enhanced hover effects for images
        const images = document.querySelectorAll('img, .ww-image, [data-ww-component="image"]');
        images.forEach(img => {
            img.classList.add('premium-image-hover');
        });

        // Add section dividers between major sections
        this.addSectionDividers();
        
        // Setup special text effects for key phrases
        this.setupSpecialTextEffects();
        
        // Add calendar integration to existing calendar icons
        this.setupCalendarIntegration();
    }

    addCalendarIntegration(button) {
        // Add calendar functionality to CTA buttons
        const calendarUrl = 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true';
        
        button.addEventListener('click', (e) => {
            // Check if it's meant to be a calendar CTA (has calendar icon or specific text)
            const hasCalendarIcon = button.querySelector('[data-lucide="calendar"]') || 
                                  button.querySelector('.lucide-calendar') ||
                                  button.textContent.toLowerCase().includes('rendez-vous') ||
                                  button.textContent.toLowerCase().includes('découverte') ||
                                  button.textContent.toLowerCase().includes('contact');
            
            if (hasCalendarIcon) {
                e.preventDefault();
                window.open(calendarUrl, '_blank', 'width=800,height=600');
            }
        });
    }

    setupCalendarIntegration() {
        // Find all calendar-related elements and convert them to booking links
        const calendarElements = document.querySelectorAll(
            '[data-lucide="calendar"], .lucide-calendar, ' +
            '[data-ww-name*="Calendar"], [data-ww-name*="Booking"]'
        );
        
        const calendarUrl = 'https://cal.com/greg-teachinspire/decouverte-teachinspire?overlayCalendar=true';
        
        calendarElements.forEach(element => {
            // Make calendar icons clickable
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                window.open(calendarUrl, '_blank', 'width=800,height=600');
            });
            
            // Add premium hover animation
            element.classList.add('premium-hover-scale-smooth');
        });
    }

    setupWordReveal(container) {
        const textElements = container.querySelectorAll('.ww-text, h1, h2, p');
        
        textElements.forEach((element) => {
            const text = element.textContent.trim();
            if (text.length > 10) { // Only apply to longer text
                const words = text.split(' ');
                if (words.length > 2) {
                    element.innerHTML = words.map((word, index) => 
                        `<span class="premium-word-reveal text-stagger-${(index % 8) + 1}">${word}</span>`
                    ).join(' ');
                }
            }
        });
    }

    setupSpecialTextEffects() {
        // Find and enhance key phrases
        const keyPhrases = [
            'premium', 'exclusive', 'luxury', 'professional', 'expert',
            'transform', 'innovative', 'cutting-edge', 'breakthrough'
        ];

        keyPhrases.forEach(phrase => {
            const elements = document.querySelectorAll('.ww-text, h1, h2, h3, p');
            elements.forEach(element => {
                const regex = new RegExp(`\\b(${phrase})\\b`, 'gi');
                if (regex.test(element.textContent)) {
                    element.innerHTML = element.innerHTML.replace(regex, 
                        `<span class="premium-highlight-reveal">$1</span>`
                    );
                }
            });
        });

        // Add gradient text effect to main headings
        const mainHeadings = document.querySelectorAll('h1, [data-name*="Hero"] .ww-text');
        mainHeadings.forEach(heading => {
            if (heading.textContent.split(' ').length <= 5) { // Only for shorter headings
                heading.classList.add('premium-gradient-text');
            }
        });

        // Add typewriter effect to specific elements (like taglines)
        const taglines = document.querySelectorAll('[data-name*="Tagline"], [data-name*="Subtitle"]');
        taglines.forEach(tagline => {
            if (tagline.textContent.length < 50) { // Only for shorter taglines
                tagline.classList.add('premium-typewriter');
            }
        });
    }

    addSectionDividers() {
        const sections = document.querySelectorAll('.ww-section, section');
        sections.forEach((section, index) => {
            if (index > 0) { // Don't add divider before first section
                const divider = document.createElement('div');
                divider.className = 'premium-section-divider';
                section.parentNode.insertBefore(divider, section);
            }
        });
    }

    // Method to manually trigger animations (useful for dynamic content)
    triggerAnimation(element, animationType = 'reveal') {
        switch(animationType) {
            case 'text':
                element.classList.add('premium-text-reveal');
                break;
            case 'image':
                element.classList.add('premium-image-reveal');
                break;
            case 'float':
                element.classList.add('premium-float');
                break;
            default:
                element.classList.add('scroll-reveal', 'revealed');
        }
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Auto-initialize when DOM is ready
function initPremiumAnimations() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PremiumScrollAnimations();
        });
    } else {
        new PremiumScrollAnimations();
    }
}

// Enhanced scroll performance
let ticking = false;

function updateScrollAnimations() {
    // Additional scroll-based effects can be added here
    if (!ticking) {
        requestAnimationFrame(() => {
            // Parallax or other scroll effects
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateScrollAnimations, { passive: true });

// Initialize animations
initPremiumAnimations();

// Export for global access
if (typeof window !== 'undefined') {
    window.PremiumScrollAnimations = PremiumScrollAnimations;
}