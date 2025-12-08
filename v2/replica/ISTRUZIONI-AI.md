# ISTRUZIONI PER L'AGENTE AI - Integrazione Cookie Banner

Questo file contiene istruzioni dettagliate per l'AI su come integrare il sistema cookie banner in un nuovo progetto.

## 🎯 OBIETTIVO
Integrare un sistema completo di gestione consenso cookie (banner + bottone) con Google Analytics 4, seguendo le stesse regole e funzionalità del progetto originale.

## 📋 FILE DISPONIBILI

1. **`ga-consent.js`** - File JavaScript principale per gestione consenso e GA4
2. **`cookie-banner.html`** - HTML completo del banner e bottone cookie
3. **`cookie-settings-script.js`** - Script JavaScript per gestione bottone cookie settings
4. **`cookie-styles.css`** - CSS completo per banner e bottone
5. **`ANALITICHE-GA4-COMPLETE.md`** - **IMPORTANTE**: Documentazione completa di TUTTE le analitiche GA4 e logica cookie
6. **`README.md`** - Guida dettagliata per utenti umani

## 🔧 PROCEDURA DI INTEGRAZIONE (per AI)

### FASE 1: Configurazione ga-consent.js

1. **Leggi il file `ga-consent.js`**
2. **Cerca la riga con `GA_MEASUREMENT_ID`** (circa riga 6)
3. **Chiedi all'utente il suo ID Google Analytics 4** (formato: G-XXXXXXXXXX)
4. **Sostituisci il valore** `'G-2KB68FNNQ8'` con l'ID fornito dall'utente
5. **Salva il file** come `ga-consent.js` nella root del progetto (o nella cartella js se esiste)

### FASE 2: Aggiunta CSS

1. **Leggi il file `cookie-styles.css`**
2. **Identifica il file CSS principale del progetto** (es. `style.css`, `main.css`, `styles.css`)
3. **Aggiungi tutto il contenuto di `cookie-styles.css`** alla fine del file CSS principale
4. **Verifica se ci sono conflitti di z-index** con altri elementi (il bottone usa z-index: 60, il banner usa z-index: 10000)
5. **Se necessario, adatta i colori** sostituendo `#FFC928` con il colore principale del progetto

### FASE 3: Aggiunta HTML in tutte le pagine

1. **Identifica tutte le pagine HTML** del progetto (es. `index.html`, `home.html`, ecc.)
2. **Per ogni pagina HTML:**
   - Leggi il file `cookie-banner.html`
   - Trova la posizione PRIMA della chiusura `</body>` in ogni pagina
   - **Incolla tutto il contenuto di `cookie-banner.html`** prima di `</body>`
   - **Modifica il link alla Privacy Policy** (cerca `href="policy.html"` e sostituisci con il percorso corretto)
   - Se il progetto non ha una Privacy Policy, rimuovi o commenta il link

### FASE 4: Aggiunta Script JavaScript

1. **Per ogni pagina HTML:**
   - Dopo aver aggiunto l'HTML del banner, aggiungi questi script PRIMA di `</body>`:
   
   ```html
   <!-- Google Analytics Consent Management -->
   <script src="ga-consent.js"></script>
   
   <script>
   // Incolla qui il contenuto completo di cookie-settings-script.js
   </script>
   ```

2. **Verifica il percorso di `ga-consent.js`**:
   - Se il file è nella root: `<script src="ga-consent.js"></script>`
   - Se il file è in una cartella js: `<script src="js/ga-consent.js"></script>`
   - Adatta il percorso in base alla struttura del progetto

### FASE 5: Verifica e Test

1. **Verifica che Font Awesome sia caricato** (necessario per l'icona del bottone cookie)
   - Se non presente, aggiungi: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">`
   - Oppure usa un'icona alternativa se Font Awesome non è disponibile

2. **Verifica che tutti gli ID siano corretti:**
   - `cookie-banner`
   - `cookie-accept`
   - `cookie-reject`
   - `cookieSettingsBtn`
   - `cookie-settings-banner`
   - `cookie-settings-overlay`
   - `cookie-settings-accept`
   - `cookie-settings-reject`
   - `cookie-settings-close`
   - `cookie-current-status`

3. **Test funzionalità:**
   - Il banner deve apparire se il consenso non è impostato o è negato
   - Il banner deve nascondersi se il consenso è accettato
   - Il bottone cookie deve essere visibile quando il banner principale non è visibile
   - Il bottone cookie deve aprire il banner di modifica consenso
   - Il consenso deve essere salvato in localStorage con chiave `cookie_consent_ideflego`

## ⚠️ REGOLE IMPORTANTI DA SEGUIRE

### Regole del Banner Principale:
1. **Il banner viene mostrato se:**
   - Il consenso non è impostato (prima visita)
   - Il consenso è negato (`'denied'`)

2. **Il banner viene nascosto se:**
   - Il consenso è accettato (`'granted'`)

3. **Il banner viene riproposto ad ogni visita** se il consenso è negato o non impostato

### Regole del Bottone Cookie Settings:
1. **Il bottone è visibile** quando il banner principale NON è visibile
2. **Il bottone è nascosto** quando il banner principale è visibile
3. **Il bottone apre un banner** per modificare il consenso in qualsiasi momento

### Regole di GA4:
1. **GA4 viene caricato SOLO** se il consenso è `'granted'`
2. **GA4 viene fermato** se il consenso viene negato
3. **GA4 viene riavviato** se il consenso viene ri-accettato

### Regole di localStorage:
1. **Chiave:** `cookie_consent_ideflego` (o quella definita in `ga-consent.js`)
2. **Valori possibili:**
   - `'granted'` - Consenso accettato
   - `'denied'` - Consenso negato
   - `null` o non presente - Consenso non impostato

3. **Il consenso è condiviso** tra tutte le pagine del sito

## 🔍 CHECKLIST FINALE PER L'AI

Prima di completare, verifica:

- [ ] `GA_MEASUREMENT_ID` configurato in `ga-consent.js`
- [ ] CSS aggiunto al file CSS principale
- [ ] HTML del banner aggiunto in TUTTE le pagine HTML
- [ ] Script `ga-consent.js` incluso in TUTTE le pagine HTML
- [ ] Script `cookie-settings-script.js` incluso in TUTTE le pagine HTML
- [ ] Link Privacy Policy aggiornato (o rimosso se non presente)
- [ ] Font Awesome caricato (o icona alternativa)
- [ ] Tutti gli ID degli elementi sono corretti
- [ ] Z-index non conflittuali con altri elementi
- [ ] Percorsi dei file corretti (relativi alla struttura del progetto)

## 🎨 PERSONALIZZAZIONI CONSIGLIATE

1. **Colori:** Sostituisci `#FFC928` con il colore principale del progetto
2. **Testo:** Modifica il testo del banner se necessario
3. **Posizione bottone:** Aggiusta `bottom` e `left` nel CSS se necessario
4. **Font Awesome:** Se non disponibile, sostituisci `<i class="fas fa-cookie"></i>` con un'icona SVG o testo

## 📝 NOTE TECNICHE

- Il sistema usa `localStorage` per salvare il consenso
- Il sistema usa `StorageEvent` per sincronizzare il consenso tra tab/iframe
- Il sistema implementa Google Consent Mode v2
- Il sistema gestisce automaticamente il caricamento di GA4
- Il sistema gestisce automaticamente la coda degli eventi GA4

## 🐛 TROUBLESHOOTING

Se qualcosa non funziona:

1. **Banner non appare:** Verifica che lo script inline nel banner sia presente
2. **Bottone non appare:** Verifica che il CSS sia caricato e che Font Awesome sia disponibile
3. **GA4 non si carica:** Verifica che `GA_MEASUREMENT_ID` sia corretto e che il consenso sia `'granted'`
4. **Errori console:** Verifica che tutti gli ID degli elementi siano corretti

## 📊 FASE 6: Implementazione Bottone INFO Prodotto (OPZIONALE ma CONSIGLIATO)

**IMPORTANTE**: Se il progetto ha schede prodotto, implementa il bottone INFO seguendo `BOTTONE-INFO-PRODOTTO.md`.

### Caratteristiche del Bottone INFO:
- Bottone giallo rettangolare con testo nero "INFO"
- Posizionato accanto alle tag/regioni nella scheda prodotto
- Apre un banner modale con dettagli del prodotto
- Traccia l'evento GA4 `product_details_view` quando viene aperto

Vedi `BOTTONE-INFO-PRODOTTO.md` per istruzioni complete.

## 📊 FASE 7: Implementazione Sistema Preferiti (OPZIONALE ma CONSIGLIATO)

**IMPORTANTE**: Se il progetto ha schede prodotto, implementa il sistema preferiti seguendo `SISTEMA-PREFERITI.md`.

### Caratteristiche del Sistema Preferiti:
- Bottone cuore su ogni scheda prodotto (in alto a destra)
- Salvataggio in `localStorage` (con fallback `sessionStorage` per `file://`)
- Traccia eventi GA4 `favorite_added` e `favorite_removed`
- Stato persistente (il cuore rimane pieno/vuoto dopo reload)
- Icona Font Awesome che cambia (far fa-heart / fas fa-heart)

Vedi `SISTEMA-PREFERITI.md` per istruzioni complete.

## 📊 FASE 8: Implementazione Analitiche GA4 (OPZIONALE ma CONSIGLIATO)

**IMPORTANTE**: Leggi il file `ANALITICHE-GA4-COMPLETE.md` per implementare tutte le analitiche GA4 del progetto originale.

### Eventi GA4 da Implementare:

1. **page_view** - Automatico (già gestito da GA4)
2. **product_details_view** - Quando si visualizzano i dettagli di un prodotto
3. **favorite_added** - Quando si aggiunge un prodotto ai preferiti
4. **favorite_removed** - Quando si rimuove un prodotto dai preferiti
5. **search** - Quando una ricerca produce risultati
6. **search_no_results** - Quando una ricerca non produce risultati
7. **filter_click** - Quando si applica/rimuove un filtro
8. **scroll_to_top_click** - Quando si clicca sul bottone scroll-to-top
9. **home_link_click** - Quando si clicca sul link "Torna a Home"
10. **social_click** - Quando si clicca su bottoni social (WhatsApp, Instagram, Telefono, Mappe)

### Regole Fondamentali per le Analitiche:

- ✅ **TUTTI gli eventi funzionano SOLO se consenso = 'granted'**
- ✅ **Usa SEMPRE `window.sendGA4Event()`** (non usare direttamente `gtag()`)
- ✅ **Inizializza sempre `dataLayer`** prima di qualsiasi evento
- ✅ **Gli eventi vengono messi in coda** se GA4 non è ancora pronto

Vedi `ANALITICHE-GA4-COMPLETE.md` per dettagli completi su ogni evento.

## ✅ COMPLETAMENTO

Quando hai completato tutte le fasi, informa l'utente che:
1. Il sistema è stato integrato con successo
2. Le analitiche GA4 sono state implementate (se richieste)
3. Deve testare su tutte le pagine
4. Deve verificare che GA4 riceva i dati correttamente
5. Può personalizzare colori e testi se necessario

