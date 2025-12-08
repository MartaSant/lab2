# Analitiche GA4 Complete - Istruzioni per l'AI

Questo documento descrive TUTTE le analitiche GA4 implementate nel progetto e la logica di quando devono funzionare in base al consenso cookie.

## 📊 EVENTI GA4 IMPLEMENTATI

### 1. **page_view** (Automatico)
- **Descrizione**: Traccia ogni visualizzazione di pagina
- **Quando viene inviato**: Automaticamente da GA4 quando una pagina viene caricata
- **Parametri**: Automatici (page_title, page_location, page_path)
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Note**: Viene anche inviato manualmente quando GA4 viene caricato dopo l'accettazione dei cookie

### 2. **product_details_view**
- **Descrizione**: Traccia quando un utente visualizza i dettagli di un prodotto
- **Quando viene inviato**: Quando si clicca sul bottone "INFO" di un prodotto
- **Parametri**:
  - `product_name` (string) - Nome del prodotto
  - `product_type` (string) - Tipo/categoria del prodotto
  - `product_region` (string) - Regione del prodotto
  - `product_price` (string) - Prezzo del prodotto
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('product_details_view', {
    'product_name': 'Falanghina IGP Campania 13%',
    'product_type': 'bianco',
    'product_region': 'campania',
    'product_price': '18,00'
});
```

### 3. **favorite_added**
- **Descrizione**: Traccia quando un utente aggiunge un prodotto ai preferiti
- **Quando viene inviato**: Quando si clicca sul cuore per aggiungere ai preferiti
- **Parametri**:
  - `product_name` (string) - Nome del prodotto
  - `product_type` (string) - Tipo/categoria del prodotto
  - `product_region` (string) - Regione del prodotto
  - `product_price` (string) - Prezzo del prodotto
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('favorite_added', {
    'product_name': 'Falanghina IGP Campania 13%',
    'product_type': 'bianco',
    'product_region': 'campania',
    'product_price': '18,00'
});
```

### 4. **favorite_removed**
- **Descrizione**: Traccia quando un utente rimuove un prodotto dai preferiti
- **Quando viene inviato**: Quando si clicca sul cuore per rimuovere dai preferiti
- **Parametri**:
  - `product_name` (string) - Nome del prodotto
  - `product_type` (string) - Tipo/categoria del prodotto
  - `product_region` (string) - Regione del prodotto
  - `product_price` (string) - Prezzo del prodotto
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('favorite_removed', {
    'product_name': 'Falanghina IGP Campania 13%',
    'product_type': 'bianco',
    'product_region': 'campania',
    'product_price': '18,00'
});
```

### 5. **search** (o **search_performed**)
- **Descrizione**: Traccia quando un utente esegue una ricerca
- **Quando viene inviato**: Quando una ricerca produce risultati
- **Parametri**:
  - `search_term` (string) - Termine di ricerca inserito
  - `search_results` (number) - Numero di risultati trovati
  - `search_type` (string) - Tipo di ricerca (es. 'wine_search')
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('search', {
    'search_term': 'chianti',
    'search_results': 5,
    'search_type': 'wine_search'
});
```

### 6. **search_no_results**
- **Descrizione**: Traccia quando una ricerca non produce risultati
- **Quando viene inviato**: Quando una ricerca non trova risultati
- **Parametri**:
  - `search_term` (string) - Termine di ricerca inserito
  - `search_type` (string) - Tipo di ricerca (es. 'wine_search')
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('search_no_results', {
    'search_term': 'xyz123',
    'search_type': 'wine_search'
});
```

### 7. **filter_click** (o **filter_applied**)
- **Descrizione**: Traccia quando un utente applica o rimuove un filtro
- **Quando viene inviato**: Quando si clicca su un bottone filtro (categoria, regione, ecc.)
- **Parametri**:
  - `filter_type` (string) - Tipo di filtro (es. 'category', 'region')
  - `filter_category` (string) - Categoria del filtro selezionato
  - `filter_action` (string) - Azione: 'activated' o 'deactivated'
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('filter_click', {
    'filter_type': 'category',
    'filter_category': 'bianco',
    'filter_action': 'activated'
});
```

### 8. **scroll_to_top_click**
- **Descrizione**: Traccia quando un utente clicca sul bottone "Torna all'inizio"
- **Quando viene inviato**: Quando si clicca sul bottone scroll-to-top
- **Parametri**:
  - `button_name` (string) - Nome del bottone (es. 'Torna all\'inizio')
  - `page_location` (string) - Percorso della pagina corrente
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('scroll_to_top_click', {
    'button_name': 'Torna all\'inizio',
    'page_location': '/filtro.html'
});
```

### 9. **home_link_click**
- **Descrizione**: Traccia quando un utente clicca sul link/bottone "Torna a Home"
- **Quando viene inviato**: Quando si clicca su un link che porta alla home
- **Parametri**:
  - `button_name` (string) - Nome del bottone/link (es. 'Torna a Home')
  - `page_location` (string) - Percorso della pagina corrente
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('home_link_click', {
    'button_name': 'Torna a Home',
    'page_location': '/taglieri.html'
});
```

### 10. **social_click**
- **Descrizione**: Traccia quando un utente clicca su un bottone social
- **Quando viene inviato**: Quando si clicca su WhatsApp, Instagram, Telefono, Mappe
- **Parametri**:
  - `button_name` (string) - Nome del bottone (es. 'WhatsApp', 'Instagram', 'Telefono', 'Mappe')
  - `button_type` (string) - Tipo di bottone (es. 'whatsapp', 'instagram', 'phone', 'maps')
- **Logica Cookie**: ✅ Funziona SOLO se consenso = 'granted'
- **Esempio**:
```javascript
window.sendGA4Event('social_click', {
    'button_name': 'WhatsApp',
    'button_type': 'whatsapp'
});
```

## 🔒 LOGICA DI FUNZIONAMENTO IN BASE AI COOKIE

### Regola Fondamentale
**TUTTI gli eventi GA4 funzionano SOLO se il consenso è 'granted'**

### Come Funziona

1. **Consenso Non Impostato o Negato**:
   - ❌ GA4 NON viene caricato
   - ❌ Nessun evento viene inviato
   - ❌ `window.sendGA4Event()` salva gli eventi in coda nel `dataLayer` ma non li invia
   - ✅ Gli eventi vengono salvati e inviati automaticamente quando il consenso viene accettato

2. **Consenso Accettato**:
   - ✅ GA4 viene caricato automaticamente
   - ✅ `window.sendGA4Event()` invia gli eventi immediatamente
   - ✅ Gli eventi in coda vengono inviati automaticamente
   - ✅ `page_view` viene inviato automaticamente per ogni pagina

3. **Consenso Revocato**:
   - ❌ GA4 viene fermato
   - ❌ Nessun nuovo evento viene inviato
   - ❌ Gli eventi successivi vengono salvati in coda ma non inviati

4. **Consenso Ri-accettato**:
   - ✅ GA4 viene ricaricato
   - ✅ Gli eventi in coda vengono inviati
   - ✅ Nuovi eventi vengono inviati normalmente

### Funzione `window.sendGA4Event()`

Questa funzione è esposta globalmente da `ga-consent.js` e gestisce automaticamente:

1. **Se GA4 è pronto**: Invia l'evento immediatamente
2. **Se GA4 non è pronto**: Salva l'evento in `dataLayer` e lo invia quando GA4 è pronto
3. **Se consenso non dato**: Salva l'evento in `dataLayer` ma non lo invia finché il consenso non viene dato

```javascript
// Uso standard (funziona sempre, anche se GA4 non è ancora pronto)
window.sendGA4Event('event_name', {
    'param1': 'value1',
    'param2': 'value2'
});
```

## 📝 IMPLEMENTAZIONE PER L'AI

### Passo 1: Verifica che `ga-consent.js` sia caricato
Assicurati che in ogni pagina ci sia:
```html
<script src="ga-consent.js"></script>
```

### Passo 2: Inizializza `dataLayer` PRIMA di qualsiasi evento
All'inizio di ogni script che usa eventi GA4:
```javascript
window.dataLayer = window.dataLayer || [];
```

### Passo 3: Usa SEMPRE `window.sendGA4Event()`
**NON usare direttamente `gtag()` o `dataLayer.push()` per eventi custom!**

❌ **SBAGLIATO**:
```javascript
gtag('event', 'product_details_view', {...});
```

✅ **CORRETTO**:
```javascript
if (window.sendGA4Event) {
    window.sendGA4Event('product_details_view', {...});
}
```

### Passo 4: Implementa ogni evento nei punti corretti

#### **product_details_view**
- Dove: Nel click handler del bottone "INFO" o "Dettagli" del prodotto
- Quando: Subito dopo aver aperto i dettagli del prodotto

#### **favorite_added**
- Dove: Nel click handler del cuore quando si aggiunge ai preferiti
- Quando: Dopo aver verificato che il prodotto non è già nei preferiti

#### **favorite_removed**
- Dove: Nel click handler del cuore quando si rimuove dai preferiti
- Quando: Dopo aver verificato che il prodotto è nei preferiti

#### **search**
- Dove: Nella funzione di ricerca quando ci sono risultati
- Quando: Dopo aver filtrato i risultati e aver contato i risultati

#### **search_no_results**
- Dove: Nella funzione di ricerca quando NON ci sono risultati
- Quando: Dopo aver verificato che la ricerca non ha prodotto risultati

#### **filter_click**
- Dove: Nel click handler dei bottoni filtro
- Quando: Dopo aver applicato o rimosso il filtro

#### **scroll_to_top_click**
- Dove: Nel click handler del bottone scroll-to-top
- Quando: Quando si clicca sul bottone

#### **home_link_click**
- Dove: Nel click handler dei link che portano alla home
- Quando: Quando si clicca sul link

#### **social_click**
- Dove: Nel click handler dei bottoni social (WhatsApp, Instagram, Telefono, Mappe)
- Quando: Quando si clicca sul bottone social

## ✅ CHECKLIST IMPLEMENTAZIONE

Per ogni evento, verifica:

- [ ] L'evento viene inviato SOLO se `window.sendGA4Event` esiste
- [ ] L'evento viene inviato nel momento corretto (dopo l'azione, non prima)
- [ ] Tutti i parametri richiesti sono presenti
- [ ] I parametri hanno i tipi corretti (string, number)
- [ ] `dataLayer` è inizializzato prima dell'evento
- [ ] L'evento funziona anche se GA4 non è ancora caricato (viene messo in coda)

## 🎯 ESEMPIO COMPLETO DI IMPLEMENTAZIONE

```javascript
// 1. Inizializza dataLayer
window.dataLayer = window.dataLayer || [];

// 2. Esempio: Click su bottone "INFO" prodotto
document.querySelectorAll('.product-info-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const product = {
            nome: 'Falanghina IGP Campania 13%',
            tono: 'bianco',
            regione: 'campania',
            prezzo: '18,00'
        };
        
        // Apri i dettagli del prodotto...
        // (codice per aprire i dettagli)
        
        // Invia evento GA4
        if (window.sendGA4Event) {
            window.sendGA4Event('product_details_view', {
                'product_name': product.nome,
                'product_type': product.tono,
                'product_region': product.regione,
                'product_price': product.prezzo
            });
        }
    });
});

// 3. Esempio: Click su cuore preferiti
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const product = {
            nome: 'Falanghina IGP Campania 13%',
            tono: 'bianco',
            regione: 'campania',
            prezzo: '18,00'
        };
        
        if (btn.classList.contains('active')) {
            // Rimuove dai preferiti
            removeFromFavorites(product.nome);
            
            // Invia evento
            if (window.sendGA4Event) {
                window.sendGA4Event('favorite_removed', {
                    'product_name': product.nome,
                    'product_type': product.tono,
                    'product_region': product.regione,
                    'product_price': product.prezzo
                });
            }
        } else {
            // Aggiunge ai preferiti
            addToFavorites(product);
            
            // Invia evento
            if (window.sendGA4Event) {
                window.sendGA4Event('favorite_added', {
                    'product_name': product.nome,
                    'product_type': product.tono,
                    'product_region': product.regione,
                    'product_price': product.prezzo
                });
            }
        }
    });
});
```

## ⚠️ NOTE IMPORTANTI

1. **NON inviare eventi se il consenso non è dato**: La funzione `window.sendGA4Event()` gestisce automaticamente questo, ma assicurati di usarla sempre

2. **Gli eventi vengono messi in coda**: Se GA4 non è ancora caricato, gli eventi vengono salvati e inviati automaticamente quando GA4 è pronto

3. **Usa sempre il check `if (window.sendGA4Event)`**: Questo evita errori se `ga-consent.js` non è caricato

4. **Inizializza sempre `dataLayer`**: Questo assicura che gli eventi possano essere messi in coda anche se GA4 non è pronto

5. **I parametri devono essere stringhe o numeri**: GA4 non accetta oggetti o array come parametri

## 🔍 VERIFICA FINALE

Dopo l'implementazione, verifica:

1. Apri la console del browser
2. Accetta i cookie
3. Esegui le azioni che dovrebbero generare eventi
4. Verifica in GA4 Realtime che gli eventi arrivino
5. Verifica che gli eventi abbiano tutti i parametri corretti

