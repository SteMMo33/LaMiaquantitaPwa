/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 */
'use strict';

const app = {
  pesiCrudiDefault: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
};

/**
 * Toggles the visibility of the add location dialog box.
 */
function toggleAddDialog() {
  app.addDialogContainer.classList.toggle('visible');
}


/**
 */
function updateData() {
  document.querySelector("#edtPattyCrudo").value = (app.pesiCrudiDefault.patty)
  document.querySelector("#edtSteCrudo").value = (app.pesiCrudiDefault.ste)
  document.querySelector("#edtTotCrudo").textContent = (app.pesiCrudiDefault.ste+app.pesiCrudiDefault.patty)
 }


/**
 * Saves.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveDefault(pesi) {
  console.log("Save default: ", pesi)
  const data = JSON.stringify(pesi);
  localStorage.setItem('pesiDefault', data);
}



/**
 * Carica i pesi crudi memorizzati
 * @return {Array}
 */
function loadPesiDefault() {
  // Guarda in LocalStorage se ci sono posti salvati
  let pesiDefault = localStorage.getItem('pesiDefault');
  console.log("ReadDefault: ", pesiDefault)
  if (pesiDefault) {
    try {
      pesiDefault = JSON.parse(pesiDefault);
    } catch (ex) {
      console.error("JSON err: ")
      pesiDefault = { patty:100, ste:100};
    }
  }
  // Dati di default se non trovati altri salvataggi in localStorage
  if (!pesiDefault || Object.keys(pesiDefault).length === 0) {
    pesiDefault = { patty: 100, ste: 100};
  }
  return pesiDefault;
}


// Ricalcolo pesi dal totale cotto
function changedPesoTotale(e){
  console.log("changed ..")
  let nPesoCrudoSte = Number(document.querySelector('#edtSteCrudo').value)
  let nPesoCrudoPatty = Number(document.querySelector('#edtPattyCrudo').value)
  let nPesoTotale = Number(document.querySelector('#edtPesoTotale').value)

  var ratio = nPesoCrudoPatty/nPesoCrudoSte
  let pesoPatty = (ratio*nPesoTotale/(1+ratio)).toFixed(0)
  let pesoSte = (nPesoTotale-pesoPatty).toFixed(0)

  document.querySelector('#pesoCottoPatty').textContent = pesoPatty
  document.querySelector('#pesoCottoSte').textContent = pesoSte
}

/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */
function init() {
  // Get the location list, and update the UI.
  app.pesiCrudiDefault = loadPesiDefault();
  updateData();

  // Set up the event handlers for all of the buttons.
  document.querySelector('#edtPesoTotale').oninput = changedPesoTotale
  document.querySelector('#edtPattyCrudo').onchange = (e) => {
    let nPeso = Number(document.querySelector('#edtPattyCrudo').value)
    app.pesiCrudiDefault.patty = nPeso
    saveDefault(app.pesiCrudiDefault)
    updateData()
  }

  document.querySelector('#edtSteCrudo').onchange = (e) => {
    let nPeso = Number(document.querySelector('#edtSteCrudo').value)
    app.pesiCrudiDefault.ste = nPeso
    saveDefault(app.pesiCrudiDefault)
    updateData()
  }
}

init();
