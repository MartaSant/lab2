# Bottone INFO Prodotto - Istruzioni per l'AI

Questo documento descrive come implementare il bottone "INFO" su ogni scheda prodotto, come nel progetto originale `filtro.html`.

## 🎯 OBIETTIVO

Implementare un bottone "INFO" su ogni scheda prodotto che:
- Si posiziona accanto alla regione/tag del prodotto
- Ha uno stile giallo rettangolare con testo nero "INFO"
- Quando cliccato, apre un banner modale con i dettagli del prodotto
- Traccia l'evento GA4 `product_details_view` quando viene aperto

## 📋 STRUTTURA HTML

### Posizionamento nella Scheda Prodotto

Il bottone INFO deve essere posizionato **accanto alle tag/regioni** del prodotto, nella stessa riga.

**Esempio di struttura scheda prodotto:**

```html
<div class="wine-card">
    <div class="wine-header">
        <h3 class="wine-name">Nome Prodotto</h3>
        <span class="wine-price">€ 18,00</span>
    </div>
    
    <div class="wine-tags">
        <span class="wine-tag wine-tag-region">campania</span>
        <span class="wine-tag wine-tag-type">bianco</span>
        
        <!-- BOTTONE INFO QUI -->
        <button class="details-btn" 
                aria-label="Mostra dettagli"
                data-product-index="0">
            INFO
        </button>
    </div>
    
    <!-- Altri elementi della scheda... -->
</div>
```

### HTML del Bottone

```html
<button class="details-btn" 
        aria-label="Mostra dettagli"
        data-product-index="${index}">
    INFO
</button>
```

**Attributi importanti:**
- `class="details-btn"` - Classe CSS per lo stile
- `aria-label="Mostra dettagli"` - Accessibilità
- `data-product-index="${index}"` - Indice del prodotto nell'array (per identificarlo)

## 🎨 CSS

### Stile del Bottone INFO

Aggiungi questo CSS al tuo file CSS principale:

```css
/* Pulsante dettagli (INFO) */
.details-btn {
    position: relative;
    display: inline-block;
    background: #FFC928;
    color: #000000;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 0.5rem;
    vertical-align: middle;
}

.details-btn:hover {
    background: #D4AF37;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 201, 40, 0.4);
}

.details-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

**Note personalizzazione:**
- `#FFC928` - Colore giallo (sostituisci con il tuo colore principale)
- `margin-left: 0.5rem` - Spaziatura dalla regione/tag precedente
- `padding: 0.4rem 0.8rem` - Dimensione del bottone
- `font-size: 0.75rem` - Dimensione del testo

### Stile del Banner Dettagli Prodotto

Aggiungi anche questo CSS per il banner modale che si apre:

```css
/* Overlay per banner dettagli */
.wine-details-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9990;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: none;
}

.wine-details-overlay.show {
    opacity: 1;
    display: block;
}

/* Banner dettagli prodotto */
.wine-details-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(17, 17, 17, 0.98);
    border-top: 2px solid #FFC928;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
    z-index: 9991;
    max-height: 85vh;
    overflow-y: auto;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    padding: 1.5rem;
}

.wine-details-banner.show {
    transform: translateY(0);
}

.wine-details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 201, 40, 0.3);
}

.wine-details-title {
    color: #FFC928;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
}

.wine-details-close {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 1.1rem;
}

.wine-details-close:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #FFC928;
    color: #FFC928;
}

.wine-details-content {
    color: #ffffff;
}

.wine-details-section {
    margin-bottom: 1.5rem;
}

.wine-details-label {
    display: block;
    color: #FFC928;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.wine-details-value {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .wine-details-banner {
        padding: 1.2rem;
        max-height: 90vh;
    }
    
    .wine-details-title {
        font-size: 1.2rem;
    }
}
```

## 📜 JAVASCRIPT

### 1. Funzione per Generare Dettagli Prodotto

```javascript
// Funzione per generare informazioni dettagliate del prodotto
function getProductDetails(product) {
    const details = {
        nome: product.nome,
        tipo: product.tipo || product.tono || product.categoria,
        regione: product.regione || product.region,
        prezzo: product.prezzo || product.price,
        descrizione: '',
        caratteristiche: '',
        abbinamenti: ''
    };
    
    // Personalizza queste descrizioni in base al tuo tipo di prodotti
    const descrizioni = {
        'bianco': 'Prodotto elegante e raffinato, perfetto per accompagnare...',
        'rosso': 'Prodotto strutturato e corposo, ideale per...',
        // Aggiungi altre categorie...
    };
    
    const caratteristiche = {
        'bianco': 'Caratteristiche del prodotto...',
        'rosso': 'Caratteristiche del prodotto...',
        // Aggiungi altre categorie...
    };
    
    const abbinamenti = {
        'bianco': 'Si abbina a...',
        'rosso': 'Si abbina a...',
        // Aggiungi altre categorie...
    };
    
    details.descrizione = descrizioni[product.tipo] || 'Prodotto di qualità, selezionato per la nostra carta.';
    details.caratteristiche = caratteristiche[product.tipo] || 'Prodotto pregiato con caratteristiche uniche.';
    details.abbinamenti = abbinamenti[product.tipo] || 'Versatile, si abbina a diversi piatti.';
    
    return details;
}
```

### 2. Funzione per Mostrare Banner Dettagli

```javascript
// Funzione per mostrare il banner con i dettagli
function showProductDetails(product) {
    const details = getProductDetails(product);
    
    // Google Analytics 4: traccia l'apertura del banner dettagli prodotto
    try {
        if (window.sendGA4Event) {
            window.sendGA4Event('product_details_view', {
                'product_name': product.nome,
                'product_type': product.tipo || product.tono,
                'product_region': product.regione,
                'product_price': product.prezzo
            });
        } else {
            // Fallback se la funzione helper non è ancora disponibile
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'product_details_view',
                'product_name': product.nome,
                'product_type': product.tipo || product.tono,
                'product_region': product.regione,
                'product_price': product.prezzo
            });
        }
    } catch (e) {
        console.error('Errore nell\'invio evento GA4:', e);
    }
    
    // Crea o aggiorna il banner
    let banner = document.getElementById('productDetailsBanner');
    let overlay = document.getElementById('productDetailsOverlay');
    
    if (!banner) {
        // Crea il banner se non esiste
        overlay = document.createElement('div');
        overlay.id = 'productDetailsOverlay';
        overlay.className = 'wine-details-overlay';
        overlay.addEventListener('click', closeProductDetails);
        
        banner = document.createElement('div');
        banner.id = 'productDetailsBanner';
        banner.className = 'wine-details-banner';
        banner.innerHTML = `
            <div class="wine-details-header">
                <h3 class="wine-details-title"></h3>
                <button class="wine-details-close" aria-label="Chiudi dettagli">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="wine-details-content">
                <div class="wine-details-section">
                    <span class="wine-details-label">Descrizione</span>
                    <p class="wine-details-value" id="product-desc"></p>
                </div>
                <div class="wine-details-section">
                    <span class="wine-details-label">Caratteristiche</span>
                    <p class="wine-details-value" id="product-char"></p>
                </div>
                <div class="wine-details-section">
                    <span class="wine-details-label">Abbinamenti</span>
                    <p class="wine-details-value" id="product-pair"></p>
                </div>
            </div>
        `;
        
        // Aggiungi event listener per il bottone chiudi
        const closeBtn = banner.querySelector('.wine-details-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeProductDetails);
        }
        
        document.body.appendChild(overlay);
        document.body.appendChild(banner);
    }
    
    // Aggiorna il contenuto del banner
    banner.querySelector('.wine-details-title').textContent = details.nome;
    document.getElementById('product-desc').textContent = details.descrizione;
    document.getElementById('product-char').textContent = details.caratteristiche;
    document.getElementById('product-pair').textContent = details.abbinamenti;
    
    // Mostra il banner
    overlay.style.display = 'block';
    banner.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(function() {
        overlay.classList.add('show');
        banner.classList.add('show');
    }, 10);
}

// Funzione per chiudere il banner
function closeProductDetails() {
    const banner = document.getElementById('productDetailsBanner');
    const overlay = document.getElementById('productDetailsOverlay');
    
    if (banner && overlay) {
        banner.classList.remove('show');
        overlay.classList.remove('show');
        
        setTimeout(function() {
            banner.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}
```

### 3. Event Listener per i Bottoni INFO

Quando generi le schede prodotto (dinamicamente o staticamente), aggiungi l'event listener:

```javascript
// Esempio: dopo aver generato le schede prodotto
function renderProducts(products) {
    const container = document.getElementById('products-grid');
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-header">
                <h3>${product.nome}</h3>
                <span class="price">€ ${product.prezzo}</span>
            </div>
            
            <div class="product-tags">
                <span class="tag tag-region">${product.regione}</span>
                <span class="tag tag-type">${product.tipo}</span>
                
                <button class="details-btn" 
                        aria-label="Mostra dettagli"
                        data-product-index="${index}">
                    INFO
                </button>
            </div>
        `;
        
        container.appendChild(productCard);
        
        // Aggiungi event listener al bottone INFO
        const detailsBtn = productCard.querySelector('.details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Previeni event bubbling
                showProductDetails(product);
            });
        }
    });
}
```

## ✅ IMPLEMENTAZIONE PER L'AI

### Passo 1: Identifica la Struttura delle Schede Prodotto

1. Trova dove vengono generate/visualizzate le schede prodotto
2. Identifica la sezione dove sono mostrate le tag/regioni/categorie
3. Questo è dove andrà posizionato il bottone INFO

### Passo 2: Aggiungi il CSS

1. Aggiungi lo stile `.details-btn` al file CSS principale
2. Aggiungi gli stili per `.wine-details-banner` e `.wine-details-overlay`
3. Personalizza i colori se necessario

### Passo 3: Aggiungi il Bottone nell'HTML

1. Nella funzione che genera le schede prodotto, aggiungi il bottone HTML
2. Posizionalo accanto alle tag/regioni
3. Aggiungi l'attributo `data-product-index` con l'indice del prodotto

### Passo 4: Implementa le Funzioni JavaScript

1. Crea la funzione `getProductDetails(product)` - personalizza le descrizioni
2. Crea la funzione `showProductDetails(product)` - mostra il banner
3. Crea la funzione `closeProductDetails()` - chiude il banner
4. Aggiungi l'event listener ai bottoni INFO

### Passo 5: Integra GA4 Tracking

1. Nella funzione `showProductDetails()`, aggiungi il tracking GA4
2. Usa `window.sendGA4Event('product_details_view', {...})`
3. Assicurati che `dataLayer` sia inizializzato

## 🎯 ESEMPIO COMPLETO

```javascript
// 1. Inizializza dataLayer
window.dataLayer = window.dataLayer || [];

// 2. Array prodotti (esempio)
const products = [
    {
        nome: 'Prodotto 1',
        tipo: 'bianco',
        regione: 'campania',
        prezzo: '18,00'
    },
    // ... altri prodotti
];

// 3. Funzione per generare dettagli
function getProductDetails(product) {
    // ... (vedi sopra)
}

// 4. Funzione per mostrare dettagli
function showProductDetails(product) {
    // ... (vedi sopra)
}

// 5. Funzione per chiudere dettagli
function closeProductDetails() {
    // ... (vedi sopra)
}

// 6. Render prodotti con bottoni INFO
function renderProducts() {
    const container = document.getElementById('products-container');
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.nome}</h3>
            <div class="tags">
                <span>${product.regione}</span>
                <button class="details-btn" data-product-index="${index}">INFO</button>
            </div>
        `;
        
        const btn = card.querySelector('.details-btn');
        btn.addEventListener('click', () => showProductDetails(product));
        
        container.appendChild(card);
    });
}

// 7. Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', renderProducts);
```

## ⚠️ NOTE IMPORTANTI

1. **Posizionamento**: Il bottone deve essere nella stessa riga delle tag/regioni
2. **Accessibilità**: Usa sempre `aria-label` per screen reader
3. **GA4 Tracking**: L'evento viene inviato SOLO se il consenso è 'granted' (gestito automaticamente da `window.sendGA4Event`)
4. **Font Awesome**: Il bottone chiudi usa Font Awesome (`fa-times`), assicurati che sia caricato
5. **Responsive**: Il banner è responsive e si adatta a schermi piccoli

## 🔍 VERIFICA FINALE

Dopo l'implementazione, verifica:

- [ ] Il bottone INFO appare su ogni scheda prodotto
- [ ] Il bottone è posizionato accanto alle tag/regioni
- [ ] Il bottone ha lo stile giallo con testo nero "INFO"
- [ ] Cliccando il bottone, si apre il banner con i dettagli
- [ ] Il banner mostra descrizione, caratteristiche e abbinamenti
- [ ] Il bottone chiudi funziona
- [ ] Cliccando l'overlay, il banner si chiude
- [ ] L'evento GA4 `product_details_view` viene inviato (verifica in console)
- [ ] Il banner è responsive su mobile

