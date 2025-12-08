# Checklist Implementazione Sincronizzazione

## ✅ CHECKLIST COMPLETA

### Script Inline nel Banner
- [ ] Lo script inline è presente in **OGNI pagina** con il banner
- [ ] Lo script è **DENTRO** il `<div id="cookie-banner">`
- [ ] Lo script è **PRIMA** del contenuto HTML del banner
- [ ] La funzione `handleBanner()` legge `localStorage.getItem(CONSENT_KEY)` **ogni volta**
- [ ] C'è un `setTimeout(handleBanner, 200)` alla fine

### Dispatch StorageEvent in ga-consent.js
- [ ] Quando si clicca "Accetta", viene dispatchato un `StorageEvent`
- [ ] Quando si clicca "Rifiuta", viene dispatchato un `StorageEvent`
- [ ] Il dispatch avviene **DOPO** `localStorage.setItem()`
- [ ] Il dispatch è avvolto in un `try-catch`
- [ ] I parametri del `StorageEvent` sono corretti (`key`, `newValue`, `oldValue`, `storageArea`)

### Listener StorageEvent in ga-consent.js
- [ ] C'è un `window.addEventListener('storage', ...)` alla fine di `ga-consent.js`
- [ ] Il listener controlla `e.key === CONSENT_KEY`
- [ ] Il listener gestisce `e.newValue === 'granted'` (carica GA4)
- [ ] Il listener gestisce `e.newValue === 'denied'` (ferma GA4)

### Dispatch StorageEvent nello Script Cookie Settings
- [ ] Quando si clicca "Accetta" nel banner settings, viene dispatchato un `StorageEvent`
- [ ] Quando si clicca "Rifiuta" nel banner settings, viene dispatchato un `StorageEvent`
- [ ] Il dispatch avviene **DOPO** `localStorage.setItem()`
- [ ] Il dispatch è avvolto in un `try-catch`

### Listener StorageEvent nello Script Cookie Settings
- [ ] C'è un `window.addEventListener('storage', ...)` nello script cookie settings
- [ ] Il listener chiama `updateConsentStatus()` quando il consenso cambia
- [ ] Il listener nasconde il banner principale se il consenso è 'granted'

### Chiave Consenso Condivisa
- [ ] Tutti gli script usano `window.CONSENT_KEY` o la stessa chiave hardcoded
- [ ] La chiave è la stessa in `ga-consent.js`, script inline, e script settings

## 🧪 TEST DI VERIFICA

### Test 1: Consenso in una pagina
- [ ] Apri `page1.html`
- [ ] Accetta i cookie
- [ ] Apri `page2.html` in una nuova tab
- [ ] ✅ Il banner NON deve apparire

### Test 2: Consenso in tab diverse
- [ ] Apri `page1.html` in tab 1
- [ ] Apri `page2.html` in tab 2
- [ ] Accetta i cookie in tab 1
- [ ] ✅ Il banner in tab 2 deve scomparire automaticamente

### Test 3: Consenso rifiutato
- [ ] Apri `page1.html`
- [ ] Rifiuta i cookie
- [ ] Apri `page2.html`
- [ ] ✅ Il banner DEVE apparire (consenso negato viene riproposto)

### Test 4: Consenso già dato
- [ ] Accetta i cookie in `page1.html`
- [ ] Chiudi il browser
- [ ] Riapri `page2.html`
- [ ] ✅ Il banner NON deve apparire

## 🐛 TROUBLESHOOTING

### Il banner appare ancora su ogni pagina
- [ ] Verifica che lo script inline sia presente in OGNI pagina
- [ ] Verifica che lo script inline sia DENTRO il div cookie-banner
- [ ] Verifica che lo script inline sia PRIMA del contenuto HTML
- [ ] Apri la console e verifica che non ci siano errori JavaScript
- [ ] Verifica che `ga-consent.js` sia caricato correttamente

### Le pagine in tab diverse non si sincronizzano
- [ ] Verifica che ci sia un listener `window.addEventListener('storage', ...)` in `ga-consent.js`
- [ ] Verifica che il listener controlli `e.key === CONSENT_KEY`
- [ ] Apri la console e verifica che il listener venga triggerato

### Le pagine nella stessa tab non si sincronizzano
- [ ] Verifica che ci sia un `window.dispatchEvent(new StorageEvent(...))` quando si accetta/rifiuta
- [ ] Verifica che il dispatch avvenga DOPO `localStorage.setItem()`
- [ ] Apri la console e verifica che il dispatch venga eseguito

### Il banner appare per un breve momento
- [ ] Verifica che lo script inline sia presente
- [ ] Verifica che lo script inline sia PRIMA del contenuto HTML
- [ ] Verifica che la funzione `handleBanner()` legga il consenso ogni volta

## 📝 NOTE FINALI

- **Tutti e 3 i meccanismi devono essere implementati**: Non basta solo uno
- **Lo script inline è CRITICO**: Senza di esso, il banner apparirà sempre per un breve momento
- **Il dispatch StorageEvent è CRITICO**: Senza di esso, le pagine nella stessa tab non si sincronizzano
- **I listener StorageEvent sono CRITICI**: Senza di essi, le pagine in tab diverse non si sincronizzano

