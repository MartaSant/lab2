// Inizializza dataLayer per GA4
window.dataLayer = window.dataLayer || [];

// ============================================
// LOG DI DEBUG - QUESTO DOVREBBE SEMPRE APPARIRE
// ============================================
console.log('╔═══════════════════════════════════════╗');
console.log('║   SCRIPT.JS CARICATO E ESECUTATO!    ║');
console.log('╚═══════════════════════════════════════╝');
console.log('Timestamp:', new Date().toISOString());
console.log('Larghezza:', window.innerWidth, 'px');
console.log('Altezza:', window.innerHeight, 'px');
console.log('URL:', window.location.href);
console.log('User Agent:', navigator.userAgent.substring(0, 50));
console.log('===========================================');

// Cattura errori globali
window.addEventListener('error', (e) => {
    console.error('ERRORE GLOBALE JavaScript:', e.error, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('PROMISE REJECTED:', e.reason);
});

// Service Worker Registration - Modalità sviluppo (Network Only)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Usa path assoluto dalla root per evitare problemi con sottocartelle
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
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
        // Se il link non inizia più con # (es. su mobile punta a servizi.html), non fare preventDefault
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) {
            return; // Lascia che il browser gestisca la navigazione normalmente
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const sectionId = target.id || '';
            const linkText = this.textContent.trim() || '';
            
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
    '.section-title, .section-subtitle, .team-card, .service-card, .info-card, .contact-form, .form-title, .form-subtitle'
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

// Inizializza team cards quando il DOM è pronto
function initTeamCards() {
    console.log('initTeamCards chiamata - larghezza finestra:', window.innerWidth);
    const teamCards = document.querySelectorAll('.team-card');
    
    if (teamCards.length === 0) {
        console.log('Nessuna card trovata, riprovo tra poco...');
        setTimeout(initTeamCards, 100);
        return;
    }
    
    console.log('Team cards trovate:', teamCards.length, 'larghezza:', window.innerWidth);
    
    // Add mouse move parallax effect to team cards (DESKTOP ONLY - completamente disattivato su mobile)
    // Funzionalità desktop: parallax effect solo su desktop
    if (window.innerWidth > 768) {
        teamCards.forEach(card => {
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
        });
    }

    // Team Slider for Mobile
    let currentSlide = 0;
    const totalSlides = 3;
    const teamSlider = document.querySelector('.team-slider');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Handle card flip on mobile (MOBILE ONLY - completamente disattivato su desktop)
    // Logica semplice: tap per girare, tap di nuovo per tornare normale
    if (window.innerWidth <= 768) {
        console.log('Inizializzazione card flip mobile - numero card:', teamCards.length, 'larghezza:', window.innerWidth);
        teamCards.forEach((card, index) => {
        // Inizializza: tutte le card partono nella forma base (non girate)
        card.isFlipped = false;
        card.flipStartTime = null;
        card.classList.remove('active'); // Assicura che non ci sia classe active di default
        
        // Reset esplicito del transform all'inizializzazione
        const cardInner = card.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transform = 'rotateY(0deg)';
            cardInner.style.transition = 'transform 0.6s'; // Assicura la transizione
        }
        
        console.log(`Event listener aggiunto alla card ${index}`);
        
        card.addEventListener('click', (e) => {
            console.log('CLICK RILEVATO sulla card!', {
                index: index,
                target: e.target.tagName,
                currentTarget: e.currentTarget.className
            });
            // Ignora click su pulsanti di navigazione
            if (e.target.closest('.slider-btn') || e.target.closest('.dot')) {
                console.log('Click ignorato: pulsante navigazione');
                return;
            }
            
            // Se il click è su un link dentro la card, previeni il comportamento di default
            // ma permetti comunque il flip della card
            if (e.target.closest('a') || e.target.tagName === 'A') {
                console.log('Click su link, prevengo default ma permetto flip');
                e.preventDefault();
                // NON fare stopPropagation qui, vogliamo che arrivi alla card
            }
            
            // Preveni eventi di default che potrebbero interferire
            e.stopPropagation();
            e.preventDefault();
            
            // Ottieni cardInner dentro l'event listener per essere sicuri
            const cardInnerEl = card.querySelector('.card-inner');
            if (!cardInnerEl) return;
            
            const now = Date.now();
            const wasFlipped = card.isFlipped;
            
            console.log('Card tapped - stato attuale:', {
                wasFlipped: wasFlipped,
                target: e.target.tagName,
                closestLink: e.target.closest('a') ? 'link trovato' : 'nessun link'
            });
            
            // STEP 1: SWITCH dello stato (toggle)
            card.isFlipped = !card.isFlipped;
            
            // Calcola durata del flip per GA4 (solo se stava girata)
            const flipDuration = wasFlipped && card.flipStartTime ? (now - card.flipStartTime) : 0;
            
            // STEP 2: Verifica lo stato dopo lo switch e applica il transform
            if (card.isFlipped) {
                // Stato: ACTIVE - applica rotateY(180deg)
                card.flipStartTime = now;
                card.classList.add('active');
                cardInnerEl.style.setProperty('transform', 'rotateY(180deg)', 'important');
            } else {
                // Stato: NON ACTIVE - applica rotateY(0deg)
                card.flipStartTime = null;
                card.classList.remove('active');
                cardInnerEl.style.setProperty('transform', 'rotateY(0deg)', 'important');
                
                // Track GA4 event: card_flip_duration (solo se durata > 0)
                if (flipDuration > 0 && window.sendGA4Event) {
                    const cardName = card.querySelector('.team-name')?.textContent?.trim() || '';
                    const cardRole = card.querySelector('.team-role')?.textContent?.trim() || 'Unknown';
                    
                    if (cardName === 'Kero') {
                        window.sendGA4Event('kero_card_flip_duration', {
                            'card_name': 'Kero',
                            'card_role': cardRole,
                            'flip_duration_msec': flipDuration,
                            'page_location': window.location.pathname
                        });
                    } else if (cardName === 'Kram') {
                        window.sendGA4Event('kram_card_flip_duration', {
                            'card_name': 'Kram',
                            'card_role': cardRole,
                            'flip_duration_msec': flipDuration,
                            'page_location': window.location.pathname
                        });
                    } else if (cardName === 'Eve') {
                        window.sendGA4Event('eve_card_flip_duration', {
                            'card_name': 'Eve',
                            'card_role': cardRole,
                            'flip_duration_msec': flipDuration,
                            'page_location': window.location.pathname
                        });
                    }
                }
            }
            
            // Forza un reflow per assicurare che il transform venga applicato
            void cardInnerEl.offsetHeight;
        });
    });
    }
}

// Chiama initTeamCards quando il DOM è pronto
console.log('Script caricato, stato DOM:', document.readyState, 'larghezza:', window.innerWidth);
if (document.readyState === 'loading') {
    console.log('DOM in caricamento, aspetto DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded evento, chiamo initTeamCards - larghezza:', window.innerWidth);
        initTeamCards();
    });
} else {
    // DOM già pronto
    console.log('DOM già pronto, chiamo initTeamCards immediatamente - larghezza:', window.innerWidth);
    initTeamCards();
}

// Listener per resize (utile quando apri/chiudi dev tools o cambi modalità)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('Finestra ridimensionata, larghezza:', window.innerWidth);
        // Reinizializza se necessario (solo se siamo su mobile e prima eravamo su desktop o viceversa)
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length > 0) {
            console.log('Reinizializzazione team cards dopo resize');
            // Rimuovi event listener vecchi e riaggiungi
            initTeamCards();
        }
    }, 300);
});

// Track GA4 event: card_hover (solo desktop, quando si passa il mouse sulle card - specifico per ogni card)
if (window.innerWidth > 768) {
    teamCards.forEach(card => {
        const cardName = card.querySelector('.team-name')?.textContent?.trim() || '';
        const cardRole = card.querySelector('.team-role')?.textContent?.trim() || 'Unknown';
        
        // Applica solo a Kero, Kram ed Eve
        if (cardName === 'Kero' || cardName === 'Kram' || cardName === 'Eve') {
            let hoverStartTime = null;
            let hoverTracked = false;
            
            card.addEventListener('mouseenter', () => {
                hoverStartTime = Date.now();
                hoverTracked = false;
                
                // Track GA4 event: card_hover (specifico per ogni card)
                if (window.sendGA4Event) {
                    const eventName = `${cardName.toLowerCase()}_card_hover`;
                    window.sendGA4Event(eventName, {
                        'card_name': cardName,
                        'card_role': cardRole,
                        'hover_action': 'mouse_enter',
                        'page_location': window.location.pathname
                    });
                    hoverTracked = true;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (hoverStartTime && hoverTracked && window.sendGA4Event) {
                    const hoverDuration = Date.now() - hoverStartTime;
                    const eventName = `${cardName.toLowerCase()}_card_hover`;
                    window.sendGA4Event(eventName, {
                        'card_name': cardName,
                        'card_role': cardRole,
                        'hover_action': 'mouse_leave',
                        'hover_duration_msec': hoverDuration,
                        'page_location': window.location.pathname
                    });
                }
                hoverStartTime = null;
            });
        }
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

// Gestione link Servizi nel menu (mobile -> servizi.html, desktop -> #services)
function updateServicesLink() {
    const servicesLink = document.querySelector('.nav-link-services');
    if (servicesLink) {
        if (window.innerWidth <= 768) {
            servicesLink.href = './servizi.html';
        } else {
            servicesLink.href = '#services';
        }
    }
}

// Aggiorna il link al caricamento e al resize
updateServicesLink();

// Scroll al form quando si clicca sulla paperella "Compila il form" su mobile
function setupDuckContactScroll() {
    const duckContact = document.querySelector('.duck-contact');
    if (duckContact) {
        // Rimuovi listener esistenti clonando l'elemento
        const newDuckContact = duckContact.cloneNode(true);
        duckContact.parentNode.replaceChild(newDuckContact, duckContact);
        
        // Aggiungi listener solo su mobile
        if (window.innerWidth <= 768) {
            const currentDuck = document.querySelector('.duck-contact');
            currentDuck.style.cursor = 'pointer';
            currentDuck.addEventListener('click', function(e) {
                e.preventDefault();
                const formWrapper = document.querySelector('.form-wrapper');
                const contactForm = document.getElementById('contactForm');
                const target = formWrapper || contactForm;
                
                if (target) {
                    const offsetTop = target.offsetTop - 100 + 1500; // Offset per l'header + 1500px più in basso
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
}

// Setup al caricamento
setupDuckContactScroll();

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateServicesLink();
        setupDuckContactScroll(); // Ricalcola il listener della paperella contatti
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
    
    // Service card click handling
    card.addEventListener('click', (e) => {
        // Service card click handling
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

// Social links handling
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Social link click handling
    });
});

// Speech bubble click handling
document.querySelectorAll('.duck-speech').forEach(speechBubble => {
    speechBubble.addEventListener('click', function(e) {
        // Previeni la propagazione per evitare che il click arrivi anche alla paperella
        e.stopPropagation();
    });
    
    // Aggiungi stile cursor pointer per indicare che è cliccabile
    speechBubble.style.cursor = 'pointer';
});

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
            const duckText = duck.querySelector('.duck-speech')?.textContent?.trim() || '';
            const duckImage = duck.querySelector('.duck-image')?.getAttribute('alt') || 'duck_guide';
            
            // Track GA4 event: duck_guide_click
            if (window.sendGA4Event) {
                window.sendGA4Event('duck_guide_click', {
                    'duck_text': duckText,
                    'duck_type': duckImage,
                    'target_section': duck.dataset.target || '',
                    'page_location': window.location.pathname
                });
            }
            
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
    } else if (duck.getAttribute('href')) {
        // Duck con href (es. servizi.html)
        duck.addEventListener('click', () => {
            // Navigation handling
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

