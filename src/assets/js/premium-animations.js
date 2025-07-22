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
        // Find all sections and major content blocks
        const sections = document.querySelectorAll('section, .ww-section, [data-section-id]');
        const textElements = document.querySelectorAll('.ww-text, h1, h2, h3, p');
        const imageElements = document.querySelectorAll('img, .ww-image');
        const cardElements = document.querySelectorAll('.ww-card, .premium-card');

        // Add scroll reveal classes based on element type and position
        sections.forEach((section, index) => {
            if (!section.classList.contains('premium-hero-section')) {
                section.classList.add('scroll-reveal');
                if (index % 2 === 0) {
                    section.classList.add('scroll-reveal-left');
                } else {
                    section.classList.add('scroll-reveal-right');
                }
            }
        });

        textElements.forEach((text, index) => {
            if (!text.closest('.premium-hero-section')) {
                text.classList.add('scroll-reveal');
                text.classList.add(`stagger-${Math.min(index % 6 + 1, 6)}`);
            }
        });

        imageElements.forEach((img, index) => {
            if (!img.closest('.premium-hero-section')) {
                img.classList.add('scroll-reveal');
                img.classList.add('premium-image-slide');
                img.classList.add(`premium-image-delay-${Math.min(index % 3 + 1, 3)}`);
            }
        });

        // Store all elements for observation
        this.elements = [
            ...Array.from(sections),
            ...Array.from(textElements),
            ...Array.from(imageElements),
            ...Array.from(cardElements)
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
        // Add hero section animation on page load
        const heroSection = document.querySelector('[data-section-id], .ww-section:first-child');
        if (heroSection) {
            heroSection.classList.add('premium-hero-section');
            
            // Add word-by-word reveal to hero text
            this.setupWordReveal(heroSection);
        }

        // Add floating animation to special images (like logos, icons)
        const floatingElements = document.querySelectorAll('[data-name*="Hourglass"], .ww-image[src*="icon"]');
        floatingElements.forEach(element => {
            element.classList.add('premium-float');
        });

        // Add glow pulse to CTA buttons
        const ctaButtons = document.querySelectorAll('[data-name*="CTA"], .ww-button[style*="f1d263"]');
        ctaButtons.forEach(button => {
            button.classList.add('premium-glow-pulse');
        });

        // Add elegant hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.ww-button, .ww-card, [role="button"]');
        interactiveElements.forEach(element => {
            element.classList.add('premium-hover-elegant');
        });

        // Add enhanced image hover effects
        const hoverImages = document.querySelectorAll('.ww-image, [data-name*="Image"]');
        hoverImages.forEach(img => {
            img.classList.add('premium-image-hover');
        });

        // Add different image reveal animations based on position
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            const animationType = index % 3;
            if (animationType === 0) {
                img.classList.add('premium-parallax-reveal');
            } else if (animationType === 1) {
                img.classList.add('premium-clip-reveal');
            } else {
                img.classList.add('premium-focus-reveal');
            }
        });

        // Add section dividers between major sections
        this.addSectionDividers();
        
        // Setup special text effects for key phrases
        this.setupSpecialTextEffects();
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