// scount.js

// Stato per la pagina Scouting
const scoutingState = {
    currentSet: 1,
    currentRotation: 'P1',
    currentPhase: 'servizio',
    homeScore: 0,
    awayScore: 0,
    actionsLog: [],
    currentSequence: [],
    setStarted: false,
    selectedPlayer: null,
    selectedEvaluation: null
};

// Inizializzazione della pagina
// Rimossa l'auto-init per SPA

function initializeScoutingPage() {
    const startSetBtn = document.getElementById('start-set');
    if (startSetBtn) startSetBtn.addEventListener('click', startSet);

    // Altri event listeners per scouting

    updateMatchInfo();
    updateScoutingUI();
}

function startSet() {
    const setNumber = document.getElementById('current-set').value;
    const rotation = document.getElementById('rotation').value;
    const phase = document.getElementById('game-phase').value;
    
    scoutingState.currentSet = parseInt(setNumber);
    scoutingState.currentRotation = rotation;
    scoutingState.currentPhase = phase;
    scoutingState.homeScore = 0;
    scoutingState.awayScore = 0;
    scoutingState.actionsLog = [];
    scoutingState.currentSequence = [];
    scoutingState.setStarted = true;
    scoutingState.selectedPlayer = null;
    scoutingState.selectedEvaluation = null;
    
    // Nascondi sezione configurazione
    document.getElementById('set-config-section').style.display = 'none';
    // Mostra sezione scouting
    document.getElementById('scouting-section').style.display = 'block';
    
    // Aggiorna UI
    updateMatchInfo();
    updateScoutingUI();
    updateCurrentPhaseDisplay();
    updateNextFundamental();
    updatePlayersGrid();
    
    // Reindirizza alla nuova pagina di scouting guidato
    window.location.href = 'Start-Scouting.html';
}

function updateMatchInfo() {
    // Funzione per aggiornare le info della partita
    // Adatta secondo necessità, assumendo che currentMatch sia disponibile globalmente o passato
}

function updateScoutingUI() {
    // Aggiorna l'UI di scouting
}

function updateCurrentPhaseDisplay() {
    const phaseElement = document.getElementById('current-phase');
    if (phaseElement) {
        phaseElement.textContent = scoutingState.currentPhase.toUpperCase();
    }
}

function predictNextFundamental() {
    // Logica per predire il prossimo fondamentale
    // Implementa come nel codice originale
    return 'a'; // Placeholder
}

function updateNextFundamental() {
    const fundamental = predictNextFundamental();
    // Aggiorna gli elementi UI
}

function getCurrentActionLogs() {
    // Recupera i log attuali
    return scoutingState.actionsLog;
}

function showScoutingStep(step) {
    // Mostra lo step guidato
}

function openDialog(dialogId) {
    const dlg = document.getElementById(dialogId);
    if (dlg) dlg.showModal();
}

function submitGuidedAction() {
    // Logica per submit azione
}

function handleOpponentError() {
    // Gestisci errore avversario
}

function updatePlayersGrid() {
    const grid = document.getElementById('players-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const activeRoster = JSON.parse(localStorage.getItem('activeRoster'));
    if (activeRoster && activeRoster.players) {
        activeRoster.players.forEach(player => {
            if (player.name || player.surname) {
                const btn = document.createElement('button');
                btn.className = 'player-btn';
                btn.textContent = `${player.number} - ${player.name} ${player.surname} (${player.role})`;
                btn.onclick = () => selectPlayer(player);
                grid.appendChild(btn);
            }
        });
    } else {
        grid.innerHTML = '<p>Nessun roster attivo caricato.</p>';
    }
}

// Altre funzioni scouting estratte e adattate...