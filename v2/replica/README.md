# Guida Integrazione Cookie Banner e Bottone Cookie Settings

Questa guida ti aiuterà a integrare il sistema di gestione consenso cookie (banner + bottone) nel tuo progetto.

## 📋 File Necessari

1. **`ga-consent.js`** - File JavaScript principale per la gestione del consenso
2. **HTML del banner** - Codice HTML da inserire in ogni pagina
3. **CSS** - Stili per il banner e il bottone (da aggiungere al tuo CSS)
4. **Script inline** - Script di controllo immediato (da inserire nel `<body>`)

---

## 🔧 Passo 1: Configurare `ga-consent.js`

### 1.1 Modifica il Measurement ID di Google Analytics

Apri `ga-consent.js` e modifica la riga 6:

```javascript
const GA_MEASUREMENT_ID = 'G-2KB68FNNQ8'; // Sostituisci con il tuo ID GA4
```

### 1.2 (Opzionale) Modifica la chiave di localStorage

Se vuoi usare una chiave diversa per il consenso (utile se hai più siti sullo stesso dominio):

```javascript
const CONSENT_KEY = 'cookie_consent_ideflego'; // Cambia se necessario
```

---

## 📄 Passo 2: Aggiungere l'HTML del Banner

Inserisci questo codice HTML **prima della chiusura del tag `</body>`** in ogni pagina:

```html
<!-- Banner Cookie Consenso -->
<div id="cookie-banner" style="display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.95); color: #ffffff; padding: 1.5rem; z-index: 10000; border-top: 2px solid #FFC928; box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);">
<script>
    // Controllo immediato del consenso PRIMA che il DOM sia completamente caricato
    // Questo assicura che il banner venga mostrato/nascosto correttamente
    (function() {
        const CONSENT_KEY = window.CONSENT_KEY || 'cookie_consent_ideflego';
        
        // Funzione per gestire il banner - legge il consenso ogni volta
        function handleBanner() {
            const banner = document.getElementById('cookie-banner');
            if (!banner) {
                // Se il banner non esiste ancora, riprova dopo un breve delay
                setTimeout(handleBanner, 50);
                return;
            }
            
            // Leggi il consenso ogni volta (non solo all'inizio)
            const consent = localStorage.getItem(CONSENT_KEY);
            
            // Se il consenso è già stato dato, nascondi il banner
            if (consent === 'granted') {
                banner.style.display = 'none';
            } else {
                // Se il consenso è negato o non esiste (null), mostra il banner
                // Questo assicura che il banner venga riproposto ad ogni visita
                banner.style.display = 'block';
            }
        }
        
        // Esegui quando il DOM è disponibile
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleBanner);
        } else {
            // Se il DOM è già pronto, esegui immediatamente
            handleBanner();
        }
        
        // Riprova anche dopo un breve delay per assicurarsi che il banner sia gestito
        setTimeout(handleBanner, 200);
    })();
</script>
    <p style="margin: 0 0 1rem 0; font-size: 0.9rem; line-height: 1.5;">
        Questo sito utilizza Google Analytics 4, Google Signals e dati demografici per migliorare l'esperienza utente. 
        I dati vengono raccolti solo con il tuo consenso esplicito.
    </p>
    <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; align-items: center;">
        <a href="policy.html" style="color: #FFC928; text-decoration: underline; font-size: 0.85rem;" id="cookie-policy-link">Privacy Policy</a>
        <button id="cookie-reject" style="padding: 0.6rem 1.5rem; background: transparent; border: 2px solid #FFC928; color: #FFC928; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
            Rifiuta
        </button>
        <button id="cookie-accept" style="padding: 0.6rem 1.5rem; background: #FFC928; border: 2px solid #FFC928; color: #000000; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
            Accetta
        </button>
    </div>
</div>

<!-- Bottone modifica consenso cookie -->
<button class="cookie-settings-btn" id="cookieSettingsBtn" aria-label="Impostazioni cookie">
    <i class="fas fa-cookie"></i>
</button>

<!-- Banner modifica consenso -->
<div id="cookie-settings-banner" class="cookie-settings-banner" style="display: none;">
    <div class="cookie-settings-content">
        <h3 class="cookie-settings-title">Gestisci le tue preferenze cookie</h3>
        <p class="cookie-settings-desc">Puoi modificare la tua scelta in qualsiasi momento.</p>
        <div class="cookie-settings-status">
            <p id="cookie-settings-status-text">Stato attuale: <strong id="cookie-current-status">Non impostato</strong></p>
        </div>
        <div class="cookie-settings-buttons">
            <button id="cookie-settings-accept" class="cookie-settings-btn-action cookie-settings-accept">
                Accetta
            </button>
            <button id="cookie-settings-reject" class="cookie-settings-btn-action cookie-settings-reject">
                Rifiuta
            </button>
            <button id="cookie-settings-close" class="cookie-settings-btn-action cookie-settings-close">
                Chiudi
            </button>
        </div>
    </div>
</div>
<div id="cookie-settings-overlay" class="cookie-settings-overlay" style="display: none;"></div>
```

**Note:**
- Modifica il link `href="policy.html"` con il percorso corretto della tua Privacy Policy
- Modifica il testo del banner se necessario
- Il colore `#FFC928` è giallo - modificalo se vuoi un colore diverso

---

## 🎨 Passo 3: Aggiungere il CSS

Aggiungi questo CSS al tuo file di stile (es. `style.css`):

```css
/* Bottone Cookie Settings */
.cookie-settings-btn {
    position: fixed;
    left: 1.4rem;
    left: calc(1.4rem + env(safe-area-inset-left));
    bottom: calc(4.6rem + 50px);
    bottom: calc(4.6rem + 50px + env(safe-area-inset-bottom));
    z-index: 60;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    border: 1px solid rgba(255, 201, 40, 0.7);
    background: rgba(17, 17, 17, 0.9);
    color: #FFC928;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.cookie-settings-btn:hover {
    background: #FFC928;
    color: #111111;
    transform: translateY(-2px);
}

.cookie-settings-btn.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

/* Banner modifica consenso */
.cookie-settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9998;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.cookie-settings-overlay.show {
    opacity: 1;
}

.cookie-settings-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(17, 17, 17, 0.98);
    border-top: 2px solid #FFC928;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
    z-index: 9999;
    padding: 1.5rem;
    max-height: 80vh;
    overflow-y: auto;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.cookie-settings-banner.show {
    transform: translateY(0);
}

.cookie-settings-content {
    max-width: 600px;
    margin: 0 auto;
    color: #ffffff;
}

.cookie-settings-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #FFC928;
}

.cookie-settings-desc {
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
    opacity: 0.8;
    line-height: 1.5;
}

.cookie-settings-status {
    background: rgba(255, 201, 40, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0 0 1.5rem 0;
    border: 1px solid rgba(255, 201, 40, 0.3);
}

.cookie-settings-status p {
    margin: 0;
    font-size: 0.9rem;
}

.cookie-settings-status strong {
    color: #FFC928;
    font-weight: 600;
}

.cookie-settings-buttons {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
}

.cookie-settings-btn-action {
    flex: 1;
    min-width: 120px;
    padding: 0.7rem 1.2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    border: 2px solid;
    transition: all 0.2s ease;
}

.cookie-settings-accept {
    background: #FFC928;
    border-color: #FFC928;
    color: #000000;
}

.cookie-settings-accept:hover {
    background: #ffd54f;
    border-color: #ffd54f;
    transform: translateY(-2px);
}

.cookie-settings-reject {
    background: transparent;
    border-color: #FFC928;
    color: #FFC928;
}

.cookie-settings-reject:hover {
    background: rgba(255, 201, 40, 0.1);
    transform: translateY(-2px);
}

.cookie-settings-close {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
    color: #ffffff;
}

.cookie-settings-close:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
    .cookie-settings-banner {
        padding: 1.2rem;
    }
    
    .cookie-settings-title {
        font-size: 1.1rem;
    }
    
    .cookie-settings-buttons {
        flex-direction: column;
    }
    
    .cookie-settings-btn-action {
        width: 100%;
    }
}
```

**Note:**
- Modifica i colori se necessario (sostituisci `#FFC928` con il tuo colore principale)
- Il bottone cookie è posizionato a sinistra, sopra il bottone WhatsApp (se presente)
- Aggiusta `bottom: calc(4.6rem + 50px)` se hai altri bottoni fluttuanti

---

## 📜 Passo 4: Aggiungere lo Script JavaScript per il Bottone Cookie

Aggiungi questo script **prima della chiusura del tag `</body>`**, dopo il caricamento di `ga-consent.js`:

```html
<script>
    // Gestione bottone cookie settings
    (function() {
        const CONSENT_KEY = window.CONSENT_KEY || 'cookie_consent_ideflego';
        
        const settingsBtn = document.getElementById('cookieSettingsBtn');
        const settingsBanner = document.getElementById('cookie-settings-banner');
        const settingsOverlay = document.getElementById('cookie-settings-overlay');
        const acceptBtn = document.getElementById('cookie-settings-accept');
        const rejectBtn = document.getElementById('cookie-settings-reject');
        const closeBtn = document.getElementById('cookie-settings-close');
        const statusText = document.getElementById('cookie-current-status');
        const mainBanner = document.getElementById('cookie-banner');
        
        if (!settingsBtn || !settingsBanner || !settingsOverlay) {
            console.warn('Elementi cookie settings non trovati');
            return;
        }
        
        // Funzione per aggiornare lo stato del consenso
        function updateConsentStatus() {
            const consent = localStorage.getItem(CONSENT_KEY);
            if (consent === 'granted') {
                statusText.textContent = 'Accettato';
                statusText.style.color = '#4CAF50';
            } else if (consent === 'denied') {
                statusText.textContent = 'Rifiutato';
                statusText.style.color = '#f44336';
            } else {
                statusText.textContent = 'Non impostato';
                statusText.style.color = '#FFC928';
            }
        }
        
        // Funzione per aprire il banner
        function openSettingsBanner() {
            updateConsentStatus();
            settingsBanner.style.display = 'block';
            settingsOverlay.style.display = 'block';
            setTimeout(function() {
                settingsBanner.classList.add('show');
                settingsOverlay.classList.add('show');
            }, 10);
        }
        
        // Funzione per chiudere il banner
        function closeSettingsBanner() {
            settingsBanner.classList.remove('show');
            settingsOverlay.classList.remove('show');
            setTimeout(function() {
                settingsBanner.style.display = 'none';
                settingsOverlay.style.display = 'none';
            }, 300);
        }
        
        // Click sul bottone cookie
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
                if (mainBanner) {
                    mainBanner.style.display = 'none';
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
        
        // Nascondi il bottone quando il banner principale è visibile
        function checkMainBanner() {
            if (mainBanner && mainBanner.style.display !== 'none' && mainBanner.offsetParent !== null) {
                settingsBtn.classList.add('hidden');
            } else {
                settingsBtn.classList.remove('hidden');
            }
        }
        
        // Controlla periodicamente lo stato del banner principale
        setInterval(checkMainBanner, 200);
        checkMainBanner();
        
        // Aggiorna lo stato iniziale
        updateConsentStatus();
        
        // Ascolta i cambiamenti di localStorage per aggiornare lo stato in tempo reale
        window.addEventListener('storage', function(e) {
            if (e.key === CONSENT_KEY) {
                updateConsentStatus();
                // Se il consenso è stato accettato altrove, nascondi il banner principale
                if (localStorage.getItem(CONSENT_KEY) === 'granted') {
                    if (mainBanner) {
                        mainBanner.style.display = 'none';
                    }
                }
            }
        });
    })();
</script>
```

---

## 🔗 Passo 5: Caricare `ga-consent.js`

Aggiungi questo script **prima della chiusura del tag `</body>`** in ogni pagina:

```html
<script src="ga-consent.js"></script>
```

Assicurati che il percorso sia corretto rispetto alla struttura delle tue cartelle.

---

## ✅ Checklist Finale

- [ ] Modificato `GA_MEASUREMENT_ID` in `ga-consent.js`
- [ ] Aggiunto HTML del banner in tutte le pagine
- [ ] Aggiunto HTML del bottone cookie settings in tutte le pagine
- [ ] Aggiunto CSS al file di stile
- [ ] Aggiunto script JavaScript per il bottone cookie
- [ ] Aggiunto `<script src="ga-consent.js"></script>` in tutte le pagine
- [ ] Modificato il link alla Privacy Policy
- [ ] Testato il funzionamento su tutte le pagine

---

## 🎨 Personalizzazione

### Cambiare i Colori

Sostituisci `#FFC928` (giallo) con il tuo colore principale in:
- HTML inline styles del banner
- CSS (`.cookie-settings-btn`, `.cookie-settings-title`, ecc.)
- Colori dei bottoni

### Cambiare la Posizione del Bottone Cookie

Modifica nel CSS:
```css
.cookie-settings-btn {
    left: 1.4rem; /* Distanza da sinistra */
    bottom: calc(4.6rem + 50px); /* Distanza dal basso */
}
```

### Cambiare il Testo del Banner

Modifica il testo nell'HTML del banner:
```html
<p style="...">
    Il tuo testo personalizzato qui
</p>
```

---

## 🐛 Troubleshooting

### Il banner non appare
- Verifica che `ga-consent.js` sia caricato correttamente
- Controlla la console del browser per errori JavaScript
- Verifica che gli ID degli elementi siano corretti (`cookie-banner`, `cookie-accept`, `cookie-reject`)

### Il bottone cookie non appare
- Verifica che il CSS sia caricato
- Controlla che non ci siano conflitti di z-index
- Verifica che Font Awesome sia caricato (per l'icona)

### GA4 non si carica
- Verifica che il `GA_MEASUREMENT_ID` sia corretto
- Controlla la console per errori di rete
- Verifica che il consenso sia stato salvato in `localStorage`

---

## 📚 Note Aggiuntive

- Il consenso è salvato in `localStorage` con la chiave `cookie_consent_ideflego` (o quella che hai configurato)
- Il consenso è condiviso tra tutte le pagine del sito
- Il banner viene riproposto se il consenso è negato o non impostato
- Il banner viene nascosto definitivamente solo se il consenso è accettato

---

Buona integrazione! 🚀

