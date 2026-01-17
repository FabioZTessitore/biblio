# biblio

gestione della biblioteca scolastica

## requisiti

Un responsabile della gestione della libreria
deve potersi autenticare, ma non registrare autonomamente,
mediante email google.
Ottenuti i permessi
di accesso potrà inserire un nuovo libro e
modificarne uno esistente (eventualmente
segnalando indisponibilità, irreperibilità,
non più in possesso, ecc.). Potrà anche
gestire il prestito dei libri inserendo
data/ora, nome dell'alunno e relativa classe,
durata prestito (es. 15 gg), identificativo del libro.
Se un prestito arriva a scadenza l'app deve inviare
una notifica al responsabile.

Un alunno (utente non autenticato) può scorrere
la lista dei libri con eventuali filtri,
selezionarne uno o più per richiederne il prestito.

ps. In previsione di utilizzi futuri aggiungere
al db i dati della scuola del progetto. Il codice
della scuola verrà utilizzato al momento della registrazione
del responsabile e associato a ogni entità.
**ATTENZIONE**: la registrazione del responsabile
non deve essere possibile attraverso questa app!

## come contribuire

Per contribuire al progetto, clonare questa repository,
lavorare su un branch **diverso da main** e poi inviare
una pull request per ogni feature/fix implementata
prestando attenzione a mantenere il proprio branch
aggiornato rispetto al main.
