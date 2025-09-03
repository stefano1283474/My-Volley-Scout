// dati_partita.js

// Stato per la pagina Dati Partita
const matchState = {
    currentMatch: null
};

// Inizializzazione della pagina
document.addEventListener('DOMContentLoaded', function() {
    initializeMatchDataPage();
});

function initializeMatchDataPage() {
    console.log('Initializing Match Data Page');
    const form = document.getElementById('new-match-form');
    if (form && !form.hasAttribute('data-initialized')) {
        form.addEventListener('submit', handleNewMatch);
        form.setAttribute('data-initialized', 'true');
    }
    
    loadMatchesList();
    updateMatchSummary();

    // Gestione nuovi pulsanti
    const newMatchBtn = document.getElementById('new-match-btn');
    const loadMatchesBtn = document.getElementById('load-matches-btn');
    const newMatchSection = document.getElementById('new-match-section');
    const matchesListSection = document.getElementById('matches-list-section');

    if (newMatchBtn && loadMatchesBtn && newMatchSection && matchesListSection) {
        const activateTabs = (activeBtn, inactiveBtn) => {
            activeBtn.classList.add('active');
            inactiveBtn.classList.remove('active');
            activeBtn.classList.remove('btn-secondary');
            activeBtn.classList.add('btn-primary');
            activeBtn.setAttribute('aria-selected', 'true');
            inactiveBtn.classList.remove('btn-primary');
            inactiveBtn.classList.add('btn-secondary');
            inactiveBtn.setAttribute('aria-selected', 'false');
        };
        const showNewTab = () => {
            newMatchSection.classList.remove('hidden');
            matchesListSection.classList.add('hidden');
            activateTabs(newMatchBtn, loadMatchesBtn);
        };
        const showListTab = () => {
            newMatchSection.classList.add('hidden');
            matchesListSection.classList.remove('hidden');
            activateTabs(loadMatchesBtn, newMatchBtn);
            loadMatchesList();
        };

        newMatchBtn.addEventListener('click', showNewTab);
        loadMatchesBtn.addEventListener('click', showListTab);

        showNewTab();
    }
}

function handleNewMatch(e) {
    e.preventDefault();
    
    const myTeam = document.getElementById('my-team').value;
    const opponentTeam = document.getElementById('opponent-team').value;
    const homeAway = document.getElementById('home-away').value;
    const matchType = document.getElementById('match-type').value;
    
    const homeTeam = homeAway === 'home' ? myTeam : opponentTeam;
    const awayTeam = homeAway === 'home' ? opponentTeam : myTeam;
    
    const match = {
        id: Date.now(),
        homeTeam,
        awayTeam,
        myTeam,
        opponentTeam,
        homeAway,
        matchType,
        date: new Date().toLocaleDateString('it-IT'),
        sets: [],
        completed: false
    };
    
    saveMatch(match);
    matchState.currentMatch = match;
    updateMatchSummary();
    loadMatchesList();
    e.target.reset();
    alert(`Partita creata: ${homeTeam} vs ${awayTeam}\nIl tuo team: ${myTeam} (${homeAway === 'home' ? 'Casa' : 'Trasferta'})`);
}

function saveMatch(match) {
    const matches = getStoredMatches();
    const existingIndex = matches.findIndex(m => m.id === match.id);
    if (existingIndex >= 0) {
        matches[existingIndex] = match;
    } else {
        matches.push(match);
    }
    localStorage.setItem('volleyMatches', JSON.stringify(matches));
}

function getStoredMatches() {
    const stored = localStorage.getItem('volleyMatches');
    return stored ? JSON.parse(stored) : [];
}

function loadMatchesList() {
    const matches = getStoredMatches();
    const container = document.getElementById('matches-list');
    
    if (matches.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Nessuna partita salvata</p>';
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-item">
            <div class="match-title">${match.homeTeam} vs ${match.awayTeam}</div>
            <div class="match-details">${match.date}</div>
            <div class="match-details">${match.matchType}</div>
            <div class="match-actions">
                <button class="btn btn-primary btn-load" onclick="loadMatch(${match.id})">Carica</button>
                <button class="btn btn-danger" onclick="deleteMatch(${match.id})">Elimina</button>
            </div>
        </div>
    `).join('');
}

function loadMatch(matchId) {
    const matches = getStoredMatches();
    const match = matches.find(m => m.id === matchId);
    
    if (match) {
        matchState.currentMatch = match;
        updateMatchSummary();
        alert(`Partita caricata: ${match.homeTeam} vs ${match.awayTeam}`);
    }
}

function deleteMatch(matchId) {
    if (confirm('Sei sicuro di voler eliminare questa partita?')) {
        const matches = getStoredMatches();
        const filtered = matches.filter(m => m.id !== matchId);
        localStorage.setItem('volleyMatches', JSON.stringify(filtered));
        loadMatchesList();
    }
}

function updateMatchSummary() {
    const dateEl = document.getElementById('summary-date');
    const typeEl = document.getElementById('summary-type');
    const teamsEl = document.getElementById('summary-teams');
    if (!dateEl || !typeEl || !teamsEl) return;

    if (matchState.currentMatch) {
        const date = matchState.currentMatch.date || '-';
        const type = matchState.currentMatch.matchType || '-';
        const myTeam = matchState.currentMatch.myTeam || matchState.currentMatch.homeTeam || '-';
        const opponent = matchState.currentMatch.opponentTeam || matchState.currentMatch.awayTeam || '-';
        teamsEl.textContent = `${myTeam} vs ${opponent}`;
        dateEl.textContent = date;
        typeEl.textContent = type;
    } else {
        dateEl.textContent = '-';
        typeEl.textContent = '-';
        teamsEl.textContent = '-';
    }
}