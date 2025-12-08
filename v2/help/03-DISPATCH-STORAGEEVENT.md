# Dispatch StorageEvent - Soluzione 2

## 🎯 OBIETTIVO

Forzare la sincronizzazione tra pagine/tab/iframe quando il consenso cambia nella stessa tab.

## 🔍 IL PROBLEMA

L'evento `storage` viene triggerato automaticamente **solo** quando `localStorage` cambia in **un'altra tab/window**.

Nella **stessa tab**, dobbiamo dispatchare manualmente l'evento per far reagire le altre pagine/iframe.

## 📍 DOVE INSERIRE

### 1. In `ga-consent.js` - Quando si accetta/rifiuta nel banner principale

```javascript
// Gestisci click su "Accetta"
acceptBtn.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    
    // ⚠️ IMPORTANTE: Dispatch esplicito di StorageEvent
    // Questo forza le altre pagine/tab/iframe a reagire immediatamente
    try {
        window.dispatchEvent(new StorageEvent('storage', {
            key: CONSENT_KEY,
            newValue: 'granted',
            oldValue: localStorage.getItem(CONSENT_KEY),
            storageArea: localStorage
        }));
    } catch (e) {
        console.log('StorageEvent non supportato, uso fallback');
    }
    
    loadGA4();
    banner.style.display = 'none';
});

// Gestisci click su "Rifiuta"
rejectBtn.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    
    // ⚠️ IMPORTANTE: Dispatch esplicito di StorageEvent
    try {
        window.dispatchEvent(new StorageEvent('storage', {
            key: CONSENT_KEY,
            newValue: 'denied',
            oldValue: localStorage.getItem(CONSENT_KEY),
            storageArea: localStorage
        }));
    } catch (e) {
        console.log('StorageEvent non supportato, uso fallback');
    }
    
    if (window.stopGA4 && typeof window.stopGA4 === 'function') {
        window.stopGA4();
    }
    
    banner.style.display = 'none';
});
```

### 2. Nello Script Cookie Settings - Quando si accetta/rifiuta dal bottone cookie

```javascript
// Click su "Accetta" nel banner settings
acceptBtn.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    
    // ⚠️ IMPORTANTE: Dispatch StorageEvent per sincronizzazione
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
    
    if (window.loadGA4 && typeof window.loadGA4 === 'function') {
        window.loadGA4();
    }
    
    if (cookieBanner) {
        cookieBanner.style.display = 'none';
    }
});

// Click su "Rifiuta" nel banner settings
rejectBtn.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    
    // ⚠️ IMPORTANTE: Dispatch StorageEvent per sincronizzazione
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
    
    if (window.stopGA4 && typeof window.stopGA4 === 'function') {
        window.stopGA4();
    }
});
```

## ⚠️ PUNTI CRITICI

1. **Dopo ogni cambio di consenso**: Dispatch l'evento DOPO aver salvato in `localStorage`
2. **Try-catch**: Avvolgi in try-catch per browser che non supportano StorageEvent personalizzato
3. **Parametri corretti**: Usa `key`, `newValue`, `oldValue`, `storageArea`
4. **Stessa chiave**: Usa la stessa `CONSENT_KEY` in tutti gli script

## ❌ ERRORI COMUNI

### ERRORE 1: Non dispatchare StorageEvent
```javascript
acceptBtn.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    // ❌ Manca il dispatch! Altre pagine nella stessa tab non reagiscono
});
```

### ERRORE 2: Dispatch prima di salvare
```javascript
window.dispatchEvent(new StorageEvent('storage', {...})); // ❌ Troppo presto!
localStorage.setItem(CONSENT_KEY, 'granted');
```

### ✅ CORRETTO: Dispatch dopo aver salvato
```javascript
localStorage.setItem(CONSENT_KEY, 'granted');
// ✅ Dispatch dopo aver salvato
window.dispatchEvent(new StorageEvent('storage', {
    key: CONSENT_KEY,
    newValue: 'granted',
    storageArea: localStorage
}));
```

## ✅ VERIFICA

Dopo l'implementazione:
1. Apri `page1.html` in tab 1
2. Apri `page2.html` in tab 2 (stesso browser)
3. Accetta i cookie in tab 1
4. ✅ Il banner in tab 2 deve scomparire automaticamente

