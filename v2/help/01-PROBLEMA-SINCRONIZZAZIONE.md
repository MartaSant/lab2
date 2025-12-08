# Problema Sincronizzazione Consenso tra Pagine

## 🚨 IL PROBLEMA

**Sintomo**: Il banner cookie appare su ogni pagina anche quando il consenso è già stato dato in un'altra pagina.

**Esempio del problema**:
1. Utente apre `page1.html`
2. Utente accetta i cookie
3. Utente naviga a `page2.html`
4. ❌ **Il banner appare di nuovo** (anche se il consenso è già stato dato)

## 🔍 CAUSE DEL PROBLEMA

### Causa 1: Timing del Controllo
- Il banner viene mostrato **prima** che `ga-consent.js` possa verificare il consenso
- Il controllo del consenso avviene **troppo tardi** nel ciclo di vita della pagina
- Risultato: Il banner appare anche per un millisecondo prima di essere nascosto

### Causa 2: Mancanza di Comunicazione tra Pagine
- Le pagine non comunicano tra loro quando il consenso cambia
- Il cambio di consenso in una pagina non viene rilevato dalle altre pagine
- Risultato: Ogni pagina controlla il consenso indipendentemente

### Causa 3: localStorage non Triggera Eventi nella Stessa Tab
- L'evento `storage` viene triggerato automaticamente solo quando `localStorage` cambia in **un'altra tab/window**
- Nella **stessa tab**, dobbiamo dispatchare manualmente l'evento
- Risultato: Le pagine nella stessa tab non si sincronizzano

## ✅ SOLUZIONE

Abbiamo implementato **3 meccanismi** che lavorano insieme:

1. **Script Inline nel Banner** - Controllo immediato PRIMA che il DOM sia caricato
2. **Dispatch StorageEvent** - Forza la sincronizzazione quando il consenso cambia
3. **Listener StorageEvent** - Reagisce ai cambiamenti di consenso da altre pagine/tab

Vedi i file successivi per i dettagli di implementazione.

