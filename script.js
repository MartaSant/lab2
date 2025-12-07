// Service Worker Registration - Modalità sviluppo (Network Only)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((registration) => {
                console.log('[Service Worker] Registrato con successo:', registration.scope);
                
                // Controlla se c'è un aggiornamento disponibile
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[Service Worker] Nuova versione disponibile');
                            // Forza l'attivazione immediata
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Errore durante la registrazione:', error);
            });
        
        // Gestisce l'aggiornamento del service worker
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                console.log('[Service Worker] Controller cambiato, ricarica pagina...');
                // Opzionale: ricarica automatica la pagina quando il service worker viene aggiornato
                // window.location.reload();
            }
        });
    });
}

// Navigation scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            let offsetTop = target.offsetTop - 80;
            
            // Special handling for team section - scroll to show cards completely
            if (target.id === 'team') {
                const teamSection = document.getElementById('team');
                const teamGrid = teamSection.querySelector('.team-grid');
                
                if (teamGrid) {
                    // Calculate position so cards are fully visible
                    // Position the grid to start lower in viewport
                    const viewportHeight = window.innerHeight;
                    const gridOffset = teamGrid.offsetTop - teamSection.offsetTop;
                    // Scroll to show section title at top and cards below, fully visible
                    let baseOffset = 200;
                    // Su mobile aggiungi 30px in più
                    if (window.innerWidth <= 768) {
                        baseOffset += 30;
                    }
                    offsetTop = teamSection.offsetTop + baseOffset;
                }
            }
            
            // Special handling for services section - scroll slightly more down
            if (target.id === 'services') {
                offsetTop = target.offsetTop + 60;
            }
            
            // Special handling for contact section - scroll 50px higher
            if (target.id === 'contact') {
                offsetTop = target.offsetTop + 60;
            }
            
            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements that need animation
const animatedElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .team-card, .service-card, .info-card, .contact-form'
);

animatedElements.forEach(el => observer.observe(el));

// Parallax effect for hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Per favore, compila tutti i campi.');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Invio in corso...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert(`Grazie ${name}! Il tuo messaggio è stato inviato. Ti risponderemo presto!`);
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
});

// Add mouse move parallax effect to team cards (desktop only)
const teamCards = document.querySelectorAll('.team-card');

teamCards.forEach(card => {
    // Only apply parallax on desktop (non-touch devices)
    if (window.innerWidth > 768) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
});

// Team Slider for Mobile
let currentSlide = 0;
const totalSlides = 3;
const teamSlider = document.querySelector('.team-slider');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Handle card flip on mobile (tap to flip)
if (window.innerWidth <= 768) {
    teamCards.forEach(card => {
        // Salva lo stato direttamente sulla card
        card.isFlipped = false;
        card.addEventListener('click', (e) => {
            // Don't flip if clicking on navigation buttons
            if (e.target.closest('.slider-btn') || e.target.closest('.dot')) {
                return;
            }
            // Toggle flip: se è girata torna normale, se è normale si gira
            card.isFlipped = !card.isFlipped;
            if (card.isFlipped) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    });
}

// Funzione per resettare tutte le card allo stato normale
function resetAllCards() {
    if (window.innerWidth <= 768) {
        teamCards.forEach(card => {
            card.classList.remove('active');
            card.isFlipped = false;
        });
    }
}

function updateSlider() {
    if (teamSlider && window.innerWidth <= 768) {
        const translateX = -currentSlide * (100 / totalSlides);
        teamSlider.style.transform = `translateX(${translateX}%)`;
        
        // Reset tutte le card quando si cambia slide
        resetAllCards();
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Navigation buttons
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1;
        }
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    });
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

if (teamSlider) {
    teamSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    teamSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    if (window.innerWidth > 768) return; // Only on mobile
    
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
        } else {
            // Swipe right - previous slide
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = totalSlides - 1;
            }
        }
        updateSlider();
    }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            // Reset slider position on desktop
            if (teamSlider) {
                teamSlider.style.transform = 'translateX(0)';
            }
            currentSlide = 0;
            updateSlider();
        } else {
            // Update slider on mobile
            updateSlider();
        }
    }, 250);
});

// Services Slider for Mobile
let currentServiceSlide = 0;
const totalServiceSlides = 11;
const servicesSlider = document.querySelector('.services-slider');
const servicesDots = document.querySelectorAll('.services-dot');
const servicesPrevBtn = document.querySelector('.services-prev-btn');
const servicesNextBtn = document.querySelector('.services-next-btn');

function updateServicesSlider() {
    if (servicesSlider && window.innerWidth <= 768) {
        // Calcola la percentuale di spostamento: ogni card è 1/11 dello slider (9.0909%)
        // Per mostrare una card per volta, spostiamo di 9.0909% per ogni slide
        const translateX = -currentServiceSlide * (100 / totalServiceSlides);
        servicesSlider.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        servicesDots.forEach((dot, index) => {
            if (index === currentServiceSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Navigation buttons
if (servicesPrevBtn && servicesNextBtn) {
    servicesPrevBtn.addEventListener('click', () => {
        if (currentServiceSlide > 0) {
            currentServiceSlide--;
        } else {
            currentServiceSlide = totalServiceSlides - 1;
        }
        updateServicesSlider();
    });

    servicesNextBtn.addEventListener('click', () => {
        if (currentServiceSlide < totalServiceSlides - 1) {
            currentServiceSlide++;
        } else {
            currentServiceSlide = 0;
        }
        updateServicesSlider();
    });
}

// Dot navigation
servicesDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentServiceSlide = index;
        updateServicesSlider();
    });
});

// Touch/Swipe support for services
let servicesTouchStartX = 0;
let servicesTouchEndX = 0;

if (servicesSlider) {
    servicesSlider.addEventListener('touchstart', (e) => {
        servicesTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    servicesSlider.addEventListener('touchend', (e) => {
        servicesTouchEndX = e.changedTouches[0].screenX;
        handleServicesSwipe();
    }, { passive: true });
}

function handleServicesSwipe() {
    if (window.innerWidth > 768) return; // Only on mobile
    
    const swipeThreshold = 50;
    const diff = servicesTouchStartX - servicesTouchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            if (currentServiceSlide < totalServiceSlides - 1) {
                currentServiceSlide++;
            } else {
                currentServiceSlide = 0;
            }
        } else {
            // Swipe right - previous slide
            if (currentServiceSlide > 0) {
                currentServiceSlide--;
            } else {
                currentServiceSlide = totalServiceSlides - 1;
            }
        }
        updateServicesSlider();
    }
}

// Handle window resize for services slider
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            // Reset services slider position on desktop
            if (servicesSlider) {
                servicesSlider.style.transform = 'translateX(0)';
            }
            currentServiceSlide = 0;
            updateServicesSlider();
        } else {
            // Update services slider on mobile
            updateServicesSlider();
        }
    }, 250);
});

// Add typing effect to hero title (optional enhancement)
const titleLines = document.querySelectorAll('.title-line');
let currentLine = 0;

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    element.style.opacity = '1';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Animate service cards on hover with stagger effect
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        serviceCards.forEach((otherCard, otherIndex) => {
            if (otherIndex !== index) {
                otherCard.style.transform = 'scale(0.95)';
                otherCard.style.opacity = '0.7';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        serviceCards.forEach(otherCard => {
            otherCard.style.transform = '';
            otherCard.style.opacity = '';
        });
    });
});

// Add cursor trail effect (optional creative feature)
let cursorTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
    
    // Remove old trail points
    cursorTrail = cursorTrail.filter(point => Date.now() - point.time < 500);
});

// Dynamic background gradient animation
function animateGradient() {
    const hero = document.querySelector('.hero');
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 1) % 360;
        // Subtle color shift effect
    }, 50);
}

// Initialize animations
window.addEventListener('load', () => {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.title-line').forEach((line, index) => {
            line.style.opacity = '1';
        });
    }, 100);
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Add particle effect on click (creative interactive feature)
document.addEventListener('click', (e) => {
    createParticles(e.clientX, e.clientY);
});

function createParticles(x, y) {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#4facfe'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        function animate() {
            posX += vx * 0.1;
            posY += vy * 0.1;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
}

console.log('%cStudio IDE', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cSviluppato con ❤️ dal team', 'color: #8b5cf6;');

// ============================================
// DUCK GUIDES - Paperelle Interattive
// ============================================

const duckGuides = document.querySelectorAll('.duck-guide');

// Observer per mostrare le paperelle quando la sezione è visibile
const duckObserverOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const duckObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Opzionale: nascondi quando esce dalla vista
            // entry.target.classList.remove('visible');
        }
    });
}, duckObserverOptions);

duckGuides.forEach(duck => {
    duckObserver.observe(duck);
    
    // Navigazione al click
    if (duck.dataset.target) {
        duck.addEventListener('click', () => {
            const target = document.querySelector(duck.dataset.target);
            if (target) {
                let offsetTop = target.offsetTop - 80;
                
                // Special handling for team section when clicked from duck - scroll more down
                if (target.id === 'team') {
                    const teamSection = document.getElementById('team');
                    const teamGrid = teamSection.querySelector('.team-grid');
                    
                    if (teamGrid) {
                        // Scroll further down to show cards completely
                        let baseOffset = 230;
                        // Su mobile aggiungi 30px in più
                        if (window.innerWidth <= 768) {
                            baseOffset += 30;
                        }
                        offsetTop = teamSection.offsetTop + baseOffset;
                    }
                }
                
                // Special handling for services section when clicked from duck - scroll more down
                if (target.id === 'services') {
                    offsetTop = target.offsetTop + 60;
                }
                
                // Special handling for contact section when clicked from duck - scroll 50px higher
                if (target.id === 'contact') {
                    offsetTop = target.offsetTop + 60;
                }
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Animazione di feedback
                duck.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    duck.style.transform = '';
                }, 200);
            }
        });
    }
    
    // Animazione continua più fluida
    setInterval(() => {
        if (duck.classList.contains('visible')) {
            const randomDelay = Math.random() * 2000;
            setTimeout(() => {
                duck.style.animation = 'none';
                setTimeout(() => {
                    duck.style.animation = '';
                }, 10);
            }, randomDelay);
        }
    }, 5000);
});

// Speech bubble sempre visibile - nessuna animazione al hover necessaria

// Paperelle decorative aggiuntive (opzionali, usando altre paperelle)
function addDecorativeDucks() {
    const sections = document.querySelectorAll('section');
    const duckImages = ['e.png', 'f.png', 'g.png', 'h.png'];
    let duckIndex = 0;
    
    sections.forEach((section, index) => {
        if (index > 0 && index < sections.length - 1 && Math.random() > 0.5) {
            const decorativeDuck = document.createElement('div');
            decorativeDuck.className = 'duck-decorative';
            decorativeDuck.style.cssText = `
                position: absolute;
                width: 40px;
                height: auto;
                opacity: 0.3;
                pointer-events: none;
                z-index: 1;
                ${index % 2 === 0 ? 'right: 5%;' : 'left: 5%;'}
                top: ${20 + Math.random() * 30}%;
                animation: float 10s ease-in-out infinite;
                animation-delay: ${index * 0.5}s;
            `;
            
            const img = document.createElement('img');
            img.src = `./paperelle/${duckImages[duckIndex % duckImages.length]}`;
            img.style.width = '100%';
            img.style.height = 'auto';
            decorativeDuck.appendChild(img);
            
            section.style.position = 'relative';
            section.appendChild(decorativeDuck);
            duckIndex++;
        }
    });
}

// Attiva paperelle decorative dopo il caricamento
window.addEventListener('load', () => {
    setTimeout(addDecorativeDucks, 1000);
});

