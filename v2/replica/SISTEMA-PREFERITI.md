# Sistema Preferiti (Bottone Cuore) - Istruzioni per l'AI

Questo documento descrive come implementare il sistema preferiti con bottone cuore, salvataggio in localStorage e integrazione GA4, come nel progetto originale.

## 🎯 OBIETTIVO

Implementare un sistema completo di preferiti che:
- Mostra un bottone cuore su ogni scheda prodotto
- Salva i preferiti in `localStorage` (con fallback a `sessionStorage` per `file://`)
- Traccia gli eventi GA4 `favorite_added` e `favorite_removed`
- Permette di visualizzare tutti i preferiti in una pagina dedicata
- Mantiene lo stato del cuore (pieno/vuoto) in base ai preferiti salvati

## 📋 STRUTTURA HTML

### Posizionamento nella Scheda Prodotto

Il bottone cuore deve essere posizionato **in alto a destra** della scheda prodotto, assolutamente posizionato.

**Esempio di struttura scheda prodotto:**

```html
<div class="product-card" style="position: relative;">
    <!-- BOTTONE CUORE QUI (in alto a destra) -->
    <button class="favorite-btn" 
            aria-label="Aggiungi ai preferiti"
            data-product-name="Nome Prodotto">
        <i class="far fa-heart"></i>
    </button>
    
    <div class="product-header">
        <h3 class="product-name">Nome Prodotto</h3>
        <span class="product-price">€ 18,00</span>
    </div>
    
    <!-- Altri elementi della scheda... -->
</div>
```

### HTML del Bottone Cuore

```html
<button class="favorite-btn ${isFavorite ? 'active' : ''}" 
        aria-label="${isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}"
        data-product-name="${product.nome}">
    <i class="${isFavorite ? 'fas fa-heart' : 'far fa-heart'}"></i>
</button>
```

**Attributi importanti:**
- `class="favorite-btn"` - Classe CSS base
- `class="favorite-btn active"` - Quando il prodotto è nei preferiti
- `aria-label` - Accessibilità (cambia in base allo stato)
- `data-product-name` - Nome del prodotto (per identificarlo)
- `<i class="far fa-heart">` - Icona cuore vuoto (non preferito)
- `<i class="fas fa-heart">` - Icona cuore pieno (preferito)

## 🎨 CSS

### Stile del Bottone Cuore

Aggiungi questo CSS al tuo file CSS principale:

```css
/* Container scheda prodotto - deve avere position: relative */
.product-card,
.wine-item {
    position: relative;
}

/* Pulsante preferiti (cuore) */
.favorite-btn {
    position: absolute;
    top: 50%;
    right: 0.55rem;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
}

.favorite-btn:hover {
    color: #FFC928;
    transform: translateY(-50%) scale(1.1);
}

.favorite-btn.active {
    color: #FFC928;
}

.favorite-btn.active:hover {
    color: #D4AF37;
}
```

**Note personalizzazione:**
- `#FFC928` - Colore giallo quando attivo (sostituisci con il tuo colore)
- `right: 0.55rem` - Distanza dal bordo destro
- `font-size: 1.5rem` - Dimensione dell'icona (150% più grande come richiesto)
- `top: 50%` + `transform: translateY(-50%)` - Centra verticalmente

## 📜 JAVASCRIPT

### 1. Configurazione Chiave localStorage

```javascript
// Chiave per salvare i preferiti in localStorage
// IMPORTANTE: Usa una chiave univoca per il tuo progetto
const FAVORITES_KEY = 'decanter_favorites'; // ⬅️ Cambia se necessario
```

### 2. Funzione per Recuperare Preferiti

```javascript
function getFavorites() {
    try {
        let favorites = localStorage.getItem(FAVORITES_KEY);
        
        // Se non c'è in localStorage e si usa file://, prova sessionStorage come fallback
        if ((!favorites || favorites === 'null' || favorites === 'undefined') && window.location.protocol === 'file:') {
            try {
                const sessionFavorites = sessionStorage.getItem(FAVORITES_KEY);
                if (sessionFavorites && sessionFavorites !== 'null' && sessionFavorites !== 'undefined') {
                    favorites = sessionFavorites;
                }
            } catch (e) {
                // Ignora errori sessionStorage
            }
        }
        
        if (!favorites || favorites === 'null' || favorites === 'undefined') {
            return [];
        }
        
        const parsed = JSON.parse(favorites);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Errore nel recupero dei preferiti:', e);
        return [];
    }
}
```

### 3. Funzione per Salvare Preferiti

```javascript
function saveFavorites(favorites) {
    try {
        const jsonData = JSON.stringify(favorites);
        
        // Salva in localStorage
        localStorage.setItem(FAVORITES_KEY, jsonData);
        
        // Se si usa file://, salva anche in sessionStorage come fallback
        if (window.location.protocol === 'file:') {
            try {
                sessionStorage.setItem(FAVORITES_KEY, jsonData);
            } catch (e) {
                // Ignora errori sessionStorage
            }
        }
    } catch (e) {
        console.error('Errore nel salvataggio dei preferiti:', e);
    }
}
```

### 4. Funzione per Verificare se un Prodotto è Preferito

```javascript
function isFavorite(productName) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.nome === productName);
}
```

**Nota**: La funzione cerca per `nome`. Se il tuo prodotto usa un campo diverso (es. `id`, `name`), modifica di conseguenza.

### 5. Funzione per Aggiungere ai Preferiti

```javascript
function addToFavorites(product) {
    const favorites = getFavorites();
    if (!isFavorite(product.nome)) {
        favorites.push(product);
        saveFavorites(favorites);
        return true;
    }
    return false;
}
```

### 6. Funzione per Rimuovere dai Preferiti

```javascript
function removeFromFavorites(productName) {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.nome !== productName);
    saveFavorites(filtered);
    return filtered.length < favorites.length;
}
```

### 7. Funzione Toggle Preferiti (Principale)

```javascript
function toggleFavorite(product, button) {
    if (isFavorite(product.nome)) {
        // Rimuove dai preferiti
        removeFromFavorites(product.nome);
        button.classList.remove('active');
        button.setAttribute('aria-label', 'Aggiungi ai preferiti');
        
        // Aggiorna icona
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        
        // Google Analytics 4: traccia la rimozione dai preferiti
        try {
            if (window.sendGA4Event) {
                window.sendGA4Event('favorite_removed', {
                    'product_name': product.nome,
                    'product_type': product.tipo || product.tono || product.categoria,
                    'product_region': product.regione || product.region,
                    'product_price': product.prezzo || product.price
                });
            } else {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'favorite_removed',
                    'product_name': product.nome,
                    'product_type': product.tipo || product.tono || product.categoria,
                    'product_region': product.regione || product.region,
                    'product_price': product.prezzo || product.price
                });
            }
        } catch (e) {
            // Silenzioso: non bloccare l'esperienza utente se GA4 fallisce
        }
    } else {
        // Aggiunge ai preferiti
        addToFavorites(product);
        button.classList.add('active');
        button.setAttribute('aria-label', 'Rimuovi dai preferiti');
        
        // Aggiorna icona
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
        
        // Google Analytics 4: traccia l'aggiunta ai preferiti
        try {
            if (window.sendGA4Event) {
                window.sendGA4Event('favorite_added', {
                    'product_name': product.nome,
                    'product_type': product.tipo || product.tono || product.categoria,
                    'product_region': product.regione || product.region,
                    'product_price': product.prezzo || product.price
                });
            } else {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'favorite_added',
                    'product_name': product.nome,
                    'product_type': product.tipo || product.tono || product.categoria,
                    'product_region': product.regione || product.region,
                    'product_price': product.prezzo || product.price
                });
            }
        } catch (e) {
            // Silenzioso: non bloccare l'esperienza utente se GA4 fallisce
        }
    }
}
```

### 8. Integrazione nella Generazione delle Schede Prodotto

Quando generi le schede prodotto, aggiungi il bottone cuore e l'event listener:

```javascript
function renderProducts(products) {
    const container = document.getElementById('products-grid');
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Verifica se il prodotto è già nei preferiti
        const isFav = isFavorite(product.nome);
        
        productCard.innerHTML = `
            <button class="favorite-btn ${isFav ? 'active' : ''}" 
                    aria-label="${isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}"
                    data-product-name="${product.nome}">
                <i class="${isFav ? 'fas fa-heart' : 'far fa-heart'}"></i>
            </button>
            
            <div class="product-header">
                <h3>${product.nome}</h3>
                <span class="price">€ ${product.prezzo}</span>
            </div>
            
            <!-- Altri elementi della scheda... -->
        `;
        
        container.appendChild(productCard);
        
        // Aggiungi event listener al bottone cuore
        const favoriteBtn = productCard.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Previeni event bubbling
                toggleFavorite(product, favoriteBtn);
            });
        }
    });
}
```

## 📄 PAGINA PREFERITI (Opzionale)

Se vuoi creare una pagina dedicata per visualizzare tutti i preferiti:

### HTML Base

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <!-- Meta tags, CSS, ecc. -->
</head>
<body>
    <div class="menu-page">
        <header class="menu-header">
            <h1>I Miei Preferiti</h1>
            <a href="home.html" class="menu-close">← Home</a>
        </header>
        
        <section class="menu-section">
            <div id="favoritesGrid" class="wine-grid">
                <!-- I preferiti verranno caricati qui -->
            </div>
            
            <div id="emptyState" style="display: none;">
                <p>Non hai ancora aggiunto prodotti ai preferiti.</p>
            </div>
        </section>
    </div>
    
    <script>
        // Inizializza dataLayer
        window.dataLayer = window.dataLayer || [];
        
        // Chiave preferiti (deve essere la stessa usata nelle altre pagine)
        const FAVORITES_KEY = 'decanter_favorites';
        const favoritesGrid = document.getElementById('favoritesGrid');
        const emptyState = document.getElementById('emptyState');
        
        // Funzioni getFavorites, saveFavorites, isFavorite, ecc. (vedi sopra)
        
        // Funzione per visualizzare i preferiti
        function displayFavorites() {
            const favorites = getFavorites();
            
            if (favorites.length === 0) {
                favoritesGrid.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }
            
            favoritesGrid.style.display = 'grid'; // o 'flex' a seconda del tuo layout
            emptyState.style.display = 'none';
            favoritesGrid.innerHTML = '';
            
            favorites.forEach((product) => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                productCard.innerHTML = `
                    <button class="favorite-btn active" 
                            aria-label="Rimuovi dai preferiti"
                            data-product-name="${product.nome}">
                        <i class="fas fa-heart"></i>
                    </button>
                    
                    <div class="product-header">
                        <h3>${product.nome}</h3>
                        <span class="price">€ ${product.prezzo}</span>
                    </div>
                    
                    <!-- Altri elementi... -->
                `;
                
                // Event listener per rimuovere dai preferiti
                const favoriteBtn = productCard.querySelector('.favorite-btn');
                favoriteBtn.addEventListener('click', function() {
                    removeFromFavorites(product.nome);
                    displayFavorites(); // Ricarica la lista
                });
                
                favoritesGrid.appendChild(productCard);
            });
        }
        
        // Carica i preferiti quando la pagina è pronta
        document.addEventListener('DOMContentLoaded', displayFavorites);
    </script>
</body>
</html>
```

## ✅ IMPLEMENTAZIONE PER L'AI

### Passo 1: Configura la Chiave localStorage

1. Scegli una chiave univoca per il tuo progetto (es. `'miosito_favorites'`)
2. Usa la stessa chiave in tutte le pagine

### Passo 2: Aggiungi il CSS

1. Aggiungi lo stile `.favorite-btn` al file CSS principale
2. Assicurati che le schede prodotto abbiano `position: relative`
3. Personalizza i colori se necessario

### Passo 3: Implementa le Funzioni JavaScript

1. Copia tutte le funzioni: `getFavorites()`, `saveFavorites()`, `isFavorite()`, `addToFavorites()`, `removeFromFavorites()`, `toggleFavorite()`
2. Adatta i nomi dei campi se il tuo prodotto usa campi diversi (es. `name` invece di `nome`)

### Passo 4: Integra nelle Schede Prodotto

1. Quando generi le schede prodotto, aggiungi il bottone cuore
2. Verifica se il prodotto è già nei preferiti usando `isFavorite()`
3. Imposta lo stato iniziale del bottone (classe `active` e icona corretta)
4. Aggiungi l'event listener al bottone

### Passo 5: Verifica Font Awesome

1. Assicurati che Font Awesome sia caricato (necessario per le icone cuore)
2. Usa `far fa-heart` per cuore vuoto e `fas fa-heart` per cuore pieno

### Passo 6: Testa il Funzionamento

1. Aggiungi un prodotto ai preferiti
2. Verifica che venga salvato in `localStorage`
3. Ricarica la pagina e verifica che il cuore sia ancora pieno
4. Rimuovi dai preferiti e verifica che venga rimosso
5. Verifica che gli eventi GA4 vengano inviati (se consenso dato)

## 🎯 ESEMPIO COMPLETO

```javascript
// 1. Inizializza dataLayer
window.dataLayer = window.dataLayer || [];

// 2. Configurazione
const FAVORITES_KEY = 'miosito_favorites'; // ⬅️ Cambia per il tuo progetto

// 3. Array prodotti (esempio)
const products = [
    {
        nome: 'Prodotto 1',
        tipo: 'bianco',
        regione: 'campania',
        prezzo: '18,00'
    },
    // ... altri prodotti
];

// 4. Funzioni preferiti (vedi sopra)
function getFavorites() { /* ... */ }
function saveFavorites(favorites) { /* ... */ }
function isFavorite(productName) { /* ... */ }
function addToFavorites(product) { /* ... */ }
function removeFromFavorites(productName) { /* ... */ }
function toggleFavorite(product, button) { /* ... */ }

// 5. Render prodotti con bottoni cuore
function renderProducts() {
    const container = document.getElementById('products-container');
    
    products.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const isFav = isFavorite(product.nome);
        
        card.innerHTML = `
            <button class="favorite-btn ${isFav ? 'active' : ''}" 
                    aria-label="${isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}"
                    data-product-name="${product.nome}">
                <i class="${isFav ? 'fas fa-heart' : 'far fa-heart'}"></i>
            </button>
            
            <h3>${product.nome}</h3>
            <span>€ ${product.prezzo}</span>
        `;
        
        const btn = card.querySelector('.favorite-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(product, btn);
        });
        
        container.appendChild(card);
    });
}

// 6. Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', renderProducts);
```

## ⚠️ NOTE IMPORTANTI

### Struttura Dati localStorage

I preferiti vengono salvati come array di oggetti:

```javascript
[
    {
        nome: 'Prodotto 1',
        tipo: 'bianco',
        regione: 'campania',
        prezzo: '18,00'
    },
    {
        nome: 'Prodotto 2',
        tipo: 'rosso',
        regione: 'toscana',
        prezzo: '25,00'
    }
]
```

### Fallback per file://

Se il sito viene aperto con `file://` protocol:
- I preferiti vengono salvati anche in `sessionStorage` come fallback
- Quando si recuperano, prova prima `localStorage`, poi `sessionStorage`

### Identificazione Prodotto

I preferiti vengono identificati per **nome** (`product.nome`). Se il tuo progetto usa un ID univoco, modifica:

```javascript
// Invece di:
favorites.some(fav => fav.nome === productName)

// Usa:
favorites.some(fav => fav.id === productId)
```

### GA4 Tracking

- Gli eventi vengono inviati SOLO se il consenso è 'granted' (gestito automaticamente da `window.sendGA4Event`)
- Gli eventi vengono messi in coda se GA4 non è ancora pronto
- Se GA4 fallisce, l'errore viene catturato silenziosamente (non blocca l'esperienza utente)

### Accessibilità

- Usa sempre `aria-label` che cambia in base allo stato
- Il bottone deve essere focusabile con la tastiera
- Usa colori con buon contrasto

## 🔍 VERIFICA FINALE

Dopo l'implementazione, verifica:

- [ ] Il bottone cuore appare su ogni scheda prodotto
- [ ] Il bottone è posizionato in alto a destra
- [ ] Il cuore è vuoto se il prodotto non è nei preferiti
- [ ] Il cuore è pieno se il prodotto è nei preferiti
- [ ] Cliccando, il prodotto viene aggiunto/rimosso dai preferiti
- [ ] Lo stato viene salvato in `localStorage`
- [ ] Lo stato persiste dopo il reload della pagina
- [ ] L'icona cambia correttamente (far/fas)
- [ ] La classe `active` viene aggiunta/rimossa correttamente
- [ ] L'evento GA4 `favorite_added` viene inviato quando si aggiunge
- [ ] L'evento GA4 `favorite_removed` viene inviato quando si rimuove
- [ ] Il fallback `sessionStorage` funziona per `file://`

## 🐛 TROUBLESHOOTING

### I preferiti non vengono salvati
- Verifica che `localStorage` sia disponibile (non in modalità incognito con restrizioni)
- Controlla la console per errori JavaScript
- Verifica che la chiave `FAVORITES_KEY` sia corretta

### Il cuore non cambia stato
- Verifica che l'event listener sia attaccato correttamente
- Controlla che `toggleFavorite()` venga chiamata
- Verifica che Font Awesome sia caricato (per le icone)

### Gli eventi GA4 non vengono inviati
- Verifica che il consenso sia 'granted'
- Controlla che `window.sendGA4Event` esista
- Verifica la console per errori

### I preferiti scompaiono dopo il reload
- Verifica che `saveFavorites()` venga chiamata
- Controlla che `localStorage` non sia bloccato
- Verifica che la chiave sia la stessa in tutte le pagine

