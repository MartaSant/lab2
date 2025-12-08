// Service Worker per fase sviluppo
// Strategia: Network Only - sempre dalla rete, mai dalla cache

const CACHE_NAME = 'studio-ide-dev-v1';
const VERSION = 'dev-1.0.0';

// Installazione del Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installazione in corso...');
    // Forza l'attivazione immediata saltando la fase di waiting
    self.skipWaiting();
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Attivazione in corso...');
    // Rimuove tutte le cache vecchie
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Rimozione cache vecchia:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Prende il controllo immediato di tutte le pagine
    return self.clients.claim();
});

// Fetch - Strategia Network Only per sviluppo
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const requestOrigin = url.origin;
    const currentOrigin = self.location.origin;
    
    // Permetti che le richieste cross-origin (script esterni, font, API) passino direttamente
    // senza essere intercettate dal Service Worker
    // Questo include: Google Analytics, Google Fonts, CDN, API esterne, ecc.
    if (requestOrigin !== currentOrigin) {
        // Per richieste cross-origin, lascia passare direttamente senza intercettare
        // Questo risolve il problema con GA4, Google Fonts, e altri script esterni
        return;
    }
    
    // Strategia: Network Only - sempre dalla rete, ignora completamente la cache
    // Solo per richieste same-origin (stesso dominio)
    event.respondWith(
        fetch(event.request, {
            cache: 'no-store',  // Ignora completamente la cache del browser
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
            .then((response) => {
                // Se la richiesta ha successo, restituisci la risposta dalla rete
                // NON salviamo in cache durante lo sviluppo
                return response;
            })
            .catch((error) => {
                // Se la richiesta fallisce (offline), mostra un messaggio di errore
                console.error('[Service Worker] Errore di rete:', error);
                
                // Per le richieste di navigazione (HTML), possiamo mostrare una pagina offline
                if (event.request.mode === 'navigate') {
                    return new Response(
                        `
                        <!DOCTYPE html>
                        <html lang="it">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Offline - Studio IDE</title>
                            <style>
                                body {
                                    font-family: 'Poppins', sans-serif;
                                    background: #0f172a;
                                    color: #fff;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    min-height: 100vh;
                                    margin: 0;
                                    text-align: center;
                                    padding: 2rem;
                                }
                                .offline-container {
                                    max-width: 500px;
                                }
                                h1 {
                                    font-size: 2rem;
                                    margin-bottom: 1rem;
                                }
                                p {
                                    color: #cbd5e1;
                                    line-height: 1.8;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="offline-container">
                                <h1>🔌 Connessione Assente</h1>
                                <p>Non è possibile caricare la pagina. Verifica la tua connessione internet e riprova.</p>
                            </div>
                        </body>
                        </html>
                        `,
                        {
                            headers: { 'Content-Type': 'text/html' }
                        }
                    );
                }
                
                // Per altre richieste, lancia l'errore
                throw error;
            })
    );
});

// Messaggio dal client per aggiornare il service worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] Caricato - Modalità sviluppo (Network Only)');

