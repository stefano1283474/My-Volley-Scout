// roster.js - Roster management for Roster.html

// Roster state
let rosterState = {
    currentRoster: [],
    rosterName: '',
    selectedRoster: null
};

// Initialize roster page
function initializeRosterPage() {
    console.log('Initializing roster page');
    // Event listeners for buttons
    const createBtn = document.getElementById('btn-create-roster');
    console.log('btn-create-roster:', createBtn);
    createBtn.addEventListener('click', () => switchRosterTab('create'));
    const listBtn = document.getElementById('btn-list-rosters');
    console.log('btn-list-rosters:', listBtn);
    listBtn.addEventListener('click', () => switchRosterTab('list'));
    const saveMain = document.getElementById('save-roster-main');
    console.log('save-roster-main:', saveMain);
    saveMain.addEventListener('click', saveCurrentRosterFromMain);
    const clearMain = document.getElementById('clear-roster-main');
    console.log('clear-roster-main:', clearMain);
    clearMain.addEventListener('click', () => clearRosterIn('main'));
    const importCreate = document.getElementById('import-roster-create');
    console.log('import-roster-create:', importCreate);
    importCreate.addEventListener('click', () => document.getElementById('import-roster-file-create').click());
    const importFileCreate = document.getElementById('import-roster-file-create');
    console.log('import-roster-file-create:', importFileCreate);
    importFileCreate.addEventListener('change', (e) => importRosterFromFileMain(e, 'main'));
    const exportMain = document.getElementById('export-roster-main');
    console.log('export-roster-main:', exportMain);
    exportMain.addEventListener('click', exportCurrentRosterToFile);
    const importMain = document.getElementById('import-roster-main');
    console.log('import-roster-main:', importMain);
    importMain.addEventListener('click', () => document.getElementById('import-roster-file-main').click());
    const importFileMain = document.getElementById('import-roster-file-main');
    console.log('import-roster-file-main:', importFileMain);
    importFileMain.addEventListener('change', (e) => importRosterFromFileMain(e, 'main'));
    const loadBtn = document.getElementById('btn-load-roster');
    console.log('btn-load-roster:', loadBtn);
    loadBtn.addEventListener('click', () => loadRosterEnabled());

    generateRosterFormIn('main');
    loadRostersListInTab();
    renderRosterTable();
}

function switchRosterTab(tab) {
    document.getElementById('btn-create-roster').classList.toggle('active', tab === 'create');
    document.getElementById('btn-list-rosters').classList.toggle('active', tab === 'list');
    document.getElementById('create-roster-section').classList.toggle('hidden', tab !== 'create');
    document.getElementById('list-rosters-section').classList.toggle('hidden', tab !== 'list');
}

function generateRosterFormIn(section) {
    const form = document.getElementById(`roster-form-${section}`);
    form.innerHTML = '';
    for (let i = 1; i <= 14; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        playerDiv.innerHTML = `
            <label>N° ${i}</label>
            <input type="text" placeholder="Nome" data-field="name" data-index="${i-1}">
            <input type="text" placeholder="Cognome" data-field="surname" data-index="${i-1}">
            <select data-field="role" data-index="${i-1}">
                <option value="">Ruolo</option>
                <option value="P">Palleggiatore</option>
                <option value="O">Opposto</option>
                <option value="C">Centrale</option>
                <option value="S">Schiacciatore</option>
                <option value="L">Libero</option>
            </select>
            <input type="text" placeholder="Nickname" data-field="nickname" data-index="${i-1}">
            <button class="btn-clear-player" onclick="clearPlayerIn('${section}', ${i-1})">Pulisci</button>
        `;
        form.appendChild(playerDiv);
    }
    // Add event listeners for inputs
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => updateRosterStateFrom(section));
    });
}

function updateRosterStateFrom(section) {
    const form = document.getElementById(`roster-form-${section}`);
    const inputs = form.querySelectorAll('input, select');
    rosterState.currentRoster = Array(14).fill().map((_, i) => ({
        number: i + 1,
        name: inputs[i*4].value,
        surname: inputs[i*4 + 1].value,
        role: inputs[i*4 + 2].value,
        nickname: inputs[i*4 + 3].value
    }));
    rosterState.rosterName = document.getElementById(`roster-name-${section}`).value;
    renderRosterTable();
}

function clearPlayerIn(section, index) {
    const form = document.getElementById(`roster-form-${section}`);
    const inputs = form.querySelectorAll(`[data-index="${index}"]`);
    inputs.forEach(input => input.value = '');
    updateRosterStateFrom(section);
}

function clearRosterIn(section) {
    document.getElementById(`roster-name-${section}`).value = '';
    const form = document.getElementById(`roster-form-${section}`);
    form.querySelectorAll('input, select').forEach(input => input.value = '');
    rosterState.currentRoster = [];
    rosterState.rosterName = '';
    renderRosterTable();
}

function saveCurrentRosterFromMain() {
    if (!rosterState.rosterName) {
        alert('Inserisci un nome per il roster');
        return;
    }
    saveRoster(rosterState.rosterName, rosterState.currentRoster);
    loadRostersListInTab();
    alert('Roster salvato!');
}

function saveRoster(name, roster) {
    const storedRosters = getStoredRosters();
    storedRosters[name] = roster;
    localStorage.setItem('rosters', JSON.stringify(storedRosters));
}

function getStoredRosters() {
    return JSON.parse(localStorage.getItem('rosters') || '{}');
}

function loadRostersListInTab() {
    const list = document.getElementById('rosters-list');
    list.innerHTML = '';
    const rosters = getStoredRosters();
    Object.keys(rosters).forEach(name => {
        const item = document.createElement('div');
        item.className = 'roster-item';
        item.innerHTML = `
            <span>${name}</span>
            <button onclick="loadRosterInTab('${name}')">Carica</button>
            <button onclick="deleteRosterFromTab('${name}')">Elimina</button>
            <button onclick="exportRoster('${name}')">Esporta</button>
        `;
        list.appendChild(item);
    });
}

function loadRosterInTab(name) {
    const rosters = getStoredRosters();
    rosterState.currentRoster = rosters[name] || [];
    rosterState.rosterName = name;
    renderRosterTable();
    switchRosterTab('create');
    document.getElementById('roster-name-main').value = name;
    const form = document.getElementById('roster-form-main');
    rosterState.currentRoster.forEach((player, i) => {
        form.querySelector(`[data-field="name"][data-index="${i}"]`).value = player.name;
        form.querySelector(`[data-field="surname"][data-index="${i}"]`).value = player.surname;
        form.querySelector(`[data-field="role"][data-index="${i}"]`).value = player.role;
        form.querySelector(`[data-field="nickname"][data-index="${i}"]`).value = player.nickname;
    });
}

function deleteRosterFromTab(name) {
    if (confirm(`Eliminare ${name}?`)) {
        const rosters = getStoredRosters();
        delete rosters[name];
        localStorage.setItem('rosters', JSON.stringify(rosters));
        loadRostersListInTab();
    }
}

function importRosterFromFileMain(event, section) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                rosterState.currentRoster = imported.players || [];
                rosterState.rosterName = imported.name || '';
                document.getElementById(`roster-name-${section}`).value = rosterState.rosterName;
                const form = document.getElementById(`roster-form-${section}`);
                rosterState.currentRoster.forEach((p, i) => {
                    form.querySelector(`[data-field="name"][data-index="${i}"]`).value = p.name;
                    form.querySelector(`[data-field="surname"][data-index="${i}"]`).value = p.surname;
                    form.querySelector(`[data-field="role"][data-index="${i}"]`).value = p.role;
                    form.querySelector(`[data-field="nickname"][data-index="${i}"]`).value = p.nickname;
                });
                renderRosterTable();
            } catch (err) {
                alert('Errore importazione: ' + err.message);
            }
        };
        reader.readAsText(file);
    }
}

function exportCurrentRosterToFile() {
    if (!rosterState.rosterName) {
        alert('Salva il roster prima di esportare');
        return;
    }
    const data = { name: rosterState.rosterName, players: rosterState.currentRoster };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rosterState.rosterName}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportRoster(name) {
    const rosters = getStoredRosters();
    const data = { name, players: rosters[name] };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function renderRosterTable() {
    const tbody = document.getElementById('roster-table-body');
    tbody.innerHTML = '';
    rosterState.currentRoster.forEach(player => {
        if (player.name || player.surname) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${player.number}</td>
                <td>${player.name}</td>
                <td>${player.surname}</td>
                <td>${player.role}</td>
                <td>${player.nickname}</td>
            `;
            tbody.appendChild(tr);
        }
    });
}

// Rimossa l'auto-init per SPA

function loadRosterEnabled() {
    if (!rosterState.rosterName || rosterState.currentRoster.length === 0) {
        alert('Nessun roster da caricare. Crea o seleziona un roster prima.');
        return;
    }
    const activeRoster = {
        name: rosterState.rosterName,
        players: rosterState.currentRoster
    };
    localStorage.setItem('activeRoster', JSON.stringify(activeRoster));
    alert('Roster caricato come attivo con successo!');
}
