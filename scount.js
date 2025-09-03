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
    
    // Mostra sezione scouting
    document.getElementById('scouting-section').style.display = 'block';
    
    // Aggiorna UI
    updateMatchInfo();
    updateScoutingUI();
    updateCurrentPhaseDisplay();
    updateNextFundamental();
    updatePlayersGrid();
    
    // Apri l'interfaccia guidata e mostra il primo step (selezione giocatore)
    showScoutingStep('step-player');
    openDialog('scouting-dialog');
    
    alert(`Set ${setNumber} iniziato! Rotazione: ${rotation}, Fase: ${phase}`);
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
    if (scoutingState.currentPhase === 'servizio') {
        return 'Servizio (b)';
    } else {
        return 'Ricezione (r)';
    }
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
    const activeRoster = JSON.parse(localStorage.getItem('activeRoster')) || { players: [] };
    const grid = document.getElementById('players-grid');
    if (!grid) return;
    grid.innerHTML = '';
    activeRoster.players.forEach(player => {
        if (player.name || player.surname) {
            const btn = document.createElement('button');
            btn.className = 'player-btn';
            btn.textContent = `${player.number} - ${player.name} ${player.surname}`;
            btn.onclick = () => selectPlayer(player);
            grid.appendChild(btn);
        }
    });
}

function selectPlayer(player) {
    scoutingState.selectedPlayer = player;
    const info = document.getElementById('selected-player-info');
    if (info) info.textContent = `${player.number} - ${player.name} ${player.surname}`;
    const fundamental = predictNextFundamental();
    document.getElementById('current-fundamental').textContent = fundamental;
    showScoutingStep('step-action');
}

function showScoutingStep(step) {
    document.querySelectorAll('.scouting-step').forEach(el => {
        el.style.display = 'none';
    });
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) stepEl.style.display = 'block';
}

function selectEvaluation(value) {
    scoutingState.selectedEvaluation = value;
    document.querySelectorAll('.eval-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function submitGuidedAction() {
    if (!scoutingState.selectedPlayer || scoutingState.selectedEvaluation === null) {
        alert('Seleziona un giocatore e una valutazione');
        return;
    }
    const fundamental = predictNextFundamental();
    const action = {
        player: scoutingState.selectedPlayer,
        fundamental: fundamental,
        evaluation: scoutingState.selectedEvaluation
    };
    scoutingState.actionsLog.push(action);
    // Semplice logica per punteggi
    if (scoutingState.selectedEvaluation >= 4) {
        scoutingState.homeScore++;
    } else if (scoutingState.selectedEvaluation <= 2) {
        scoutingState.awayScore++;
    }
    updateScoutingUI();
    // Resetta
    scoutingState.selectedPlayer = null;
    scoutingState.selectedEvaluation = null;
    document.querySelectorAll('.eval-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('selected-player-info').textContent = '';
    document.getElementById('current-fundamental').textContent = '';
    showScoutingStep('player');
}

function submitOpponentError() {
    scoutingState.homeScore++;
    const action = { type: 'opponent_error' };
    scoutingState.actionsLog.push(action);
    updateScoutingUI();
    showScoutingStep('player');
}

function updateScoutingUI() {
    document.querySelector('.home-score').textContent = scoutingState.homeScore;
    document.querySelector('.away-score').textContent = scoutingState.awayScore;
    // Aggiorna log se necessario
    const logList = document.getElementById('actions-list');
    logList.innerHTML = '';
    scoutingState.actionsLog.forEach(action => {
        const item = document.createElement('div');
        item.textContent = action.player ? `${action.player.name} - ${action.fundamental} - ${action.evaluation}` : action.type;
        logList.appendChild(item);
    });
}

function closeScoutingDialog() {
    const dlg = document.getElementById('scouting-dialog');
    if (dlg) dlg.close();
    document.getElementById('scouting-section').style.display = 'none';
    scoutingState.setStarted = false;
    // Resetta altri stati se necessario
    scoutingState.homeScore = 0;
    scoutingState.awayScore = 0;
    scoutingState.actionsLog = [];
    scoutingState.currentSequence = [];
    scoutingState.selectedPlayer = null;
    scoutingState.selectedEvaluation = null;
}