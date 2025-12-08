# Indice - Sincronizzazione Consenso tra Pagine

Questa cartella contiene la documentazione completa su come implementare correttamente la sincronizzazione del consenso cookie tra tutte le pagine del sito.

## 📚 File Disponibili

1. **`01-PROBLEMA-SINCRONIZZAZIONE.md`** - Spiega il problema e le cause
2. **`02-SCRIPT-INLINE-BANNER.md`** - Soluzione 1: Script inline nel banner
3. **`03-DISPATCH-STORAGEEVENT.md`** - Soluzione 2: Dispatch StorageEvent
4. **`04-LISTENER-STORAGEEVENT.md`** - Soluzione 3: Listener StorageEvent
5. **`05-CHECKLIST-IMPLEMENTAZIONE.md`** - Checklist completa e test di verifica

## 🎯 Ordine di Lettura Consigliato

1. Leggi `01-PROBLEMA-SINCRONIZZAZIONE.md` per capire il problema
2. Leggi `02-SCRIPT-INLINE-BANNER.md` per la prima soluzione
3. Leggi `03-DISPATCH-STORAGEEVENT.md` per la seconda soluzione
4. Leggi `04-LISTENER-STORAGEEVENT.md` per la terza soluzione
5. Usa `05-CHECKLIST-IMPLEMENTAZIONE.md` per verificare l'implementazione

## ⚠️ IMPORTANTE

**Tutte e 3 le soluzioni devono essere implementate insieme!**

- Solo script inline → Banner non appare, ma pagine non si sincronizzano
- Solo dispatch → Pagine si sincronizzano, ma banner appare brevemente
- Solo listener → Funziona solo tra tab diverse, non nella stessa tab

**Solo implementando tutte e 3 le soluzioni insieme si risolve completamente il problema.**

## 🔗 Riferimenti

Per la documentazione completa del sistema cookie banner, vedi:
- `../replica/README.md` - Guida principale
- `../replica/SINCRONIZZAZIONE-CONSENSO-TRA-PAGINE.md` - Documentazione completa

