# Script Inline nel Banner - Soluzione 1

## 🎯 OBIETTIVO

Evitare che il banner appaia anche per un millisecondo quando il consenso è già stato dato.

## 📍 DOVE INSERIRE

Lo script **DEVE essere all'interno del `<div id="cookie-banner">`**, **PRIMA del contenuto HTML** del banner.

## 📝 CODICE

```html
<div id="cookie-banner" style="display: none; ...">
<script>
    // ⚠️ QUESTO SCRIPT È CRITICO - NON RIMUOVERLO!
    // Controllo immediato del consenso PRIMA che il DOM sia completamente caricato
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
            
            // ⚠️ IMPORTANTE: Leggi il consenso OGNI VOLTA (non solo all'inizio)
            // Questo assicura che se il consenso cambia in un'altra pagina/tab,
            // questa pagina reagisce immediatamente
            const consent = localStorage.getItem(CONSENT_KEY);
            
            // Se il consenso è già stato dato, nascondi il banner
            if (consent === 'granted') {
                banner.style.display = 'none';
            } else {
                // Se il consenso è negato o non esiste (null), mostra il banner
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
        
        // ⚠️ IMPORTANTE: Riprova anche dopo un breve delay
        // Questo gestisce casi edge dove il DOM è pronto ma il banner non è ancora nel DOM
        setTimeout(handleBanner, 200);
    })();
</script>
    <!-- Contenuto HTML del banner qui -->
</div>
```

## ⚠️ PUNTI CRITICI

1. **Posizione**: Lo script DEVE essere DENTRO il div, PRIMA del contenuto HTML
2. **Lettura consenso**: Leggi `localStorage.getItem(CONSENT_KEY)` **ogni volta**, non solo all'inizio
3. **Retry**: Riprova se il banner non esiste ancora (gestisce timing edge cases)
4. **Delay finale**: Il `setTimeout(handleBanner, 200)` gestisce casi dove il DOM è pronto ma il banner non è ancora accessibile

## ❌ ERRORI COMUNI

### ERRORE 1: Script dopo il contenuto HTML
```html
<div id="cookie-banner">
    <p>Contenuto...</p>
    <script>
        // ❌ TROPPO TARDI! Il banner è già visibile
    </script>
</div>
```

### ERRORE 2: Leggere consenso solo all'inizio
```javascript
const consent = localStorage.getItem(CONSENT_KEY); // ❌ Solo all'inizio

function handleBanner() {
    // Usa 'consent' qui - ma è il valore vecchio!
}
```

### ✅ CORRETTO: Leggere consenso ogni volta
```javascript
function handleBanner() {
    const consent = localStorage.getItem(CONSENT_KEY); // ✅ Ogni volta
    // ...
}
```

## ✅ VERIFICA

Dopo l'implementazione:
1. Accetta i cookie in `page1.html`
2. Apri `page2.html` in una nuova tab
3. ✅ Il banner NON deve apparire (nemmeno per un millisecondo)

