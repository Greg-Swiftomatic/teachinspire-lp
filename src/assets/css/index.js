 import './common.css';
 
// Load premium animations and production initialization
const animationScript = document.createElement('script');
animationScript.src = '/src/assets/js/premium-animations.js';
animationScript.defer = true;
document.head.appendChild(animationScript);

const productionScript = document.createElement('script');
productionScript.src = '/src/assets/js/production-init.js';
productionScript.defer = true;
document.head.appendChild(productionScript);
