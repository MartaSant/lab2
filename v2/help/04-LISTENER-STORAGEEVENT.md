# Listener StorageEvent - Soluzione 3

## 🎯 OBIETTIVO

Far reagire le pagine ai cambiamenti di consenso che avvengono in altre pagine/tab/iframe.

## 🔍 COME FUNZIONA

L'evento `storage` viene triggerato automaticamente quando `localStorage` cambia in **un'altra tab/window**.

I listener `StorageEvent` permettono alle pagine di reagire immediatamente a questi cambiamenti.

## 📍 DOVE INSERIRE

### 1. In `ga-consent.js` - Alla fine del file

```javascript
// ⚠️ IMPORTANTE: Ascolta i cambiamenti di localStorage per rilevare quando 
// il consenso viene dato in altre pagine/iframe/tab
window.addEventListener('storage', function(e) {
    if (e.key === CONSENT_KEY && e.newValue === 'granted') {
        // Il consenso è stato dato in un'altra pagina/iframe, carica GA4
        if (!window.gtag || !window.dataLayer || typeof window.gtag !== 'function') {
            loadGA4();
        } else {
            // GA4 è già caricato, aggiorna solo i flag
            ga4Ready = true;
            window.ga4Ready = true;
        }
    } else if (e.key === CONSENT_KEY && e.newValue === 'denied') {
        // Il consenso è stato negato in un'altra pagina/iframe, ferma GA4
        stopGA4();
    }
});
```

### 2. Nello Script Cookie Settings - Per aggiornare lo stato

```javascript
// ⚠️ IMPORTANTE: Listener StorageEvent per sincronizzazione
window.addEventListener('storage', function(e) {
    if (e.key === CONSENT_KEY) {
        // Aggiorna lo stato visualizzato
        updateConsentStatus();
        
        // Se il consenso è stato accettato altrove, nascondi il banner principale
        if (localStorage.getItem(CONSENT_KEY) === 'granted') {
            const mainBanner = document.getElementById('cookie-banner');
            if (mainBanner) {
                mainBanner.style.display = 'none';
            }
        }
    }
});
```

## ⚠️ PUNTI CRITICI

1. **Chiave corretta**: Controlla sempre `e.key === CONSENT_KEY`
2. **Valore nuovo**: Controlla `e.newValue` per sapere il nuovo stato
3. **Aggiorna stato**: Quando il consenso cambia, aggiorna lo stato visualizzato
4. **Nascondi banner**: Se il consenso è 'granted', nascondi il banner principale

## 🔄 FLUSSO COMPLETO

### Scenario: Utente accetta cookie in Tab 1

1. **Tab 1**: Click su "Accetta"
   - `localStorage.setItem(CONSENT_KEY, 'granted')`
   - `window.dispatchEvent(new StorageEvent(...))` ← Dispatch manuale
   - Banner si nasconde in Tab 1

2. **Tab 2**: Listener StorageEvent si attiva
   - Rileva che `e.key === CONSENT_KEY` e `e.newValue === 'granted'`
   - Chiama `loadGA4()` se necessario
   - Nasconde il banner se presente

3. **Risultato**: Entrambe le tab sono sincronizzate

## ❌ ERRORI COMUNI

### ERRORE 1: Non controllare la chiave
```javascript
window.addEventListener('storage', function(e) {
    // ❌ Reagisce a TUTTI i cambiamenti di localStorage, non solo al consenso
    if (e.newValue === 'granted') {
        loadGA4();
    }
});
```

### ✅ CORRETTO: Controllare la chiave
```javascript
window.addEventListener('storage', function(e) {
    if (e.key === CONSENT_KEY && e.newValue === 'granted') {
        loadGA4();
    }
});
```

### ERRORE 2: Non aggiornare lo stato visualizzato
```javascript
window.addEventListener('storage', function(e) {
    if (e.key === CONSENT_KEY) {
        // ❌ Manca l'aggiornamento dello stato visualizzato
    }
});
```

### ✅ CORRETTO: Aggiornare lo stato
```javascript
window.addEventListener('storage', function(e) {
    if (e.key === CONSENT_KEY) {
        updateConsentStatus(); // ✅ Aggiorna lo stato
        if (localStorage.getItem(CONSENT_KEY) === 'granted') {
            // Nascondi banner se necessario
        }
    }
});
```

## ✅ VERIFICA

Dopo l'implementazione:
1. Apri `page1.html` in tab 1
2. Apri `page2.html` in tab 2
3. Accetta i cookie in tab 1
4. ✅ Tab 2 reagisce automaticamente (banner scompare, GA4 si carica)

