# LaMiaQuantità partendo da articolo Google:

In this codelab, you'll  build a weather web app using Progressive Web App
techniques. Your app will:

* Use responsive design, so it works on desktop or mobile.
* Be fast & reliable, using a service worker to precache the app resources
  (HTML, CSS, JavaScript, images) needed to run, and cache the weather data
  at runtime to improve performance.
* Be installable, using a web app manifest and the `beforeinstallprompt` event
  to notify the user it's installable.
  Su Android appare sia l'icona nella pagina che un'icona nel browser.

## Mie modifiche
* Ho creato il progetto seguendo le istruzioni del codelab.
* Ho creato un progetto nella console di Firebase di Google.
* Ho creato un hosting in cui ho fatto deploy del progetto da linea di comando.
* ho installato l'app sul cellulare puntando il browser sull'indirizzo web del hosting. L'app si è installata tra le applicazioni normali ed ha creato un'icona sul desktop.
* Modificato il progetto ed eseguito il deploy
* L'app si è aggiornata sul cellulare senza notifica


### Live server
La prova di test con server locale è stata fatta anche con l'estensione *Live Server* di *Visual Studio Code* che monta un server sulla porta 4500. 
Per spostare la root del webserver sulla cartella *public*, ed eventualmente cambiare il numero di porta, è stato necessario inserire un file di configurazione in *.vscode/settings.json*

## Firebase

Registrato il progetto in https://myfirstpwa-37305.web.app/
Da questo indirizzo è possibile installare l'app sul telefonino.

Comando per il deploy:

```
firebase deploy
```

