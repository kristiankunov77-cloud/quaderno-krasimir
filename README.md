# Quaderno di Krasimir

App web personale per le cose da fare di ogni giorno (obiettivi con punti), le spese e il riepilogo del mese.

- Per ogni obiettivo di oggi non ancora fatto arriva una notifica con suono e vibrazione, agli orari scelti e all'ora del singolo obiettivo.
- I file del sito vengono pubblicati con GitHub Pages dalla cartella principale.
- I dati sono salvati su Supabase nella tabella `quaderno_krasimir`, protetti da login e da regole di accesso.
- In `config.js` ci sono solo l'indirizzo del progetto e la chiave pubblica: nessuna password.
- Le notifiche arrivano dalla funzione "promemoria" del progetto Supabase (dispositivi con `app = 'krasimir'`).
