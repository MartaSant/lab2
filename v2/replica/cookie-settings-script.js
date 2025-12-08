// Script JavaScript per gestione bottone e banner modifica consenso cookie
// 
// ISTRUZIONI PER L'AI:
// 1. Incolla tutto questo codice PRIMA della chiusura del tag </body> in OGNI pagina HTML
// 2. Assicurati che ga-consent.js sia già caricato PRIMA di questo script
// 3. Assicurati che gli elementi HTML del banner e bottone siano già presenti nel DOM
// 4. Il codice deve essere incluso in un tag <script> o aggiunto a uno script esistente

(function() {
    // Usa la chiave globale da ga-consent.js, fallback a 'cookie_consent_ideflego' se non disponibile
    const CONSENT_KEY = window.CONSENT_KEY || 'cookie_consent_ideflego';
    const settingsBtn = document.getElementById('cookieSettingsBtn');
    const settingsBanner = document.getElementById('cookie-settings-banner');
    const settingsOverlay = document.getElementById('cookie-settings-overlay');
    const acceptBtn = document.getElementById('cookie-settings-accept');
    const rejectBtn = document.getElementById('cookie-settings-reject');
    const closeBtn = document.getElementById('cookie-settings-close');
    const statusText = document.getElementById('cookie-current-status');
    const cookieBanner = document.getElementById('cookie-banner');
    
    if (!settingsBtn || !settingsBanner || !settingsOverlay) {
        console.warn('Elementi cookie settings non trovati');
        return;
    }
    
    // Funzione per aggiornare lo stato visualizzato
    function updateConsentStatus() {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (statusText) {
            if (consent === 'granted') {
                statusText.textContent = 'Accettato';
                statusText.style.color = '#4CAF50';
            } else if (consent === 'denied') {
                statusText.textContent = 'Rifiutato';
                statusText.style.color = '#F44336';
            } else {
                statusText.textContent = 'Non impostato';
                statusText.style.color = '#FFC928';
            }
        }
    }
    
    // Funzione per mostrare/nascondere il bottone in base al banner cookie
    function toggleSettingsButton() {
        if (cookieBanner && cookieBanner.style.display !== 'none' && cookieBanner.offsetParent !== null) {
            // Banner cookie visibile, nascondi bottone
            settingsBtn.classList.add('hidden');
        } else {
            // Banner cookie non visibile, mostra bottone
            settingsBtn.classList.remove('hidden');
        }
    }
    
    // Controlla periodicamente se il banner cookie è visibile
    setInterval(toggleSettingsButton, 500);
    toggleSettingsButton(); // Controllo iniziale
    
    // Funzione per aprire il banner modifica consenso
    function openSettingsBanner() {
        updateConsentStatus();
        settingsBanner.style.display = 'block';
        settingsOverlay.style.display = 'block';
        
        setTimeout(function() {
            settingsBanner.classList.add('open');
            settingsOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }, 10);
    }
    
    // Funzione per chiudere il banner modifica consenso
    function closeSettingsBanner() {
        settingsBanner.classList.remove('open');
        settingsOverlay.classList.remove('show');
        
        setTimeout(function() {
            settingsBanner.style.display = 'none';
            settingsOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Click sul bottone per aprire il banner
    settingsBtn.addEventListener('click', function() {
        openSettingsBanner();
    });
    
    // Click sull'overlay per chiudere
    settingsOverlay.addEventListener('click', function() {
        closeSettingsBanner();
    });
    
    // Click su "Accetta"
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem(CONSENT_KEY, 'granted');
            updateConsentStatus();
            
            // Avvia GA4 se disponibile
            if (window.loadGA4 && typeof window.loadGA4 === 'function') {
                window.loadGA4();
            }
            
            // Nascondi il banner principale se visibile
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
            
            // Chiudi il banner dopo un breve delay
            setTimeout(function() {
                closeSettingsBanner();
            }, 500);
            
            // Triggera evento storage per sincronizzare altre pagine
            try {
                window.dispatchEvent(new StorageEvent('storage', {
                    key: CONSENT_KEY,
                    newValue: 'granted',
                    oldValue: localStorage.getItem(CONSENT_KEY),
                    storageArea: localStorage
                }));
            } catch (e) {
                console.log('StorageEvent non supportato');
            }
        });
    }
    
    // Click su "Rifiuta"
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            localStorage.setItem(CONSENT_KEY, 'denied');
            updateConsentStatus();
            
            // Ferma GA4 quando il consenso viene negato
            if (window.stopGA4 && typeof window.stopGA4 === 'function') {
                window.stopGA4();
            }
            
            // Chiudi il banner dopo un breve delay
            setTimeout(function() {
                closeSettingsBanner();
            }, 500);
            
            // Triggera evento storage per sincronizzare altre pagine
            try {
                window.dispatchEvent(new StorageEvent('storage', {
                    key: CONSENT_KEY,
                    newValue: 'denied',
                    oldValue: localStorage.getItem(CONSENT_KEY),
                    storageArea: localStorage
                }));
            } catch (e) {
                console.log('StorageEvent non supportato');
            }
        });
    }
    
    // Click su "Chiudi"
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeSettingsBanner();
        });
    }
    
    // Aggiorna lo stato iniziale
    updateConsentStatus();
    
    // Ascolta i cambiamenti di localStorage per aggiornare lo stato in tempo reale
    window.addEventListener('storage', function(e) {
        if (e.key === CONSENT_KEY) {
            updateConsentStatus();
            // Se il consenso è stato accettato altrove, nascondi il banner principale
            if (localStorage.getItem(CONSENT_KEY) === 'granted') {
                if (cookieBanner) {
                    cookieBanner.style.display = 'none';
                }
            }
        }
    });
})();

