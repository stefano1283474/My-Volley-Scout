// Firebase config viene caricato globalmente
// Le funzioni sono disponibili tramite window o import dinamico

// Servizio per gestire i dati dell'app con Firestore
const firestoreService = {
    
    // === GESTIONE PARTITE ===
    
    // Salva una nuova partita
    saveMatch: async (matchData) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const matchToSave = {
                ...matchData,
                userId: user.uid,
                userEmail: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await firestoreFunctions.addDocument('matches', matchToSave);
            return result;
        } catch (error) {
            console.error('Errore nel salvataggio della partita:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Carica tutte le partite dell'utente
    loadUserMatches: async () => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const result = await firestoreFunctions.getUserMatches();
            return result;
        } catch (error) {
            console.error('Errore nel caricamento delle partite:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Aggiorna una partita esistente
    updateMatch: async (matchId, matchData) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const updateData = {
                ...matchData,
                updatedAt: new Date()
            };
            
            const result = await firestoreFunctions.updateDocument('matches', matchId, updateData);
            return result;
        } catch (error) {
            console.error('Errore nell\'aggiornamento della partita:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Elimina una partita
    deleteMatch: async (matchId) => {
        try {
            const result = await firestoreFunctions.deleteDocument('matches', matchId);
            return result;
        } catch (error) {
            console.error('Errore nell\'eliminazione della partita:', error);
            return { success: false, error: error.message };
        }
    },
    
    // === GESTIONE ROSTER ===
    
    // Salva un nuovo roster
    saveRoster: async (rosterData) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const rosterToSave = {
                ...rosterData,
                userId: user.uid,
                userEmail: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await firestoreFunctions.addDocument('rosters', rosterToSave);
            return result;
        } catch (error) {
            console.error('Errore nel salvataggio del roster:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Carica tutti i roster dell'utente
    loadUserRosters: async () => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const result = await firestoreFunctions.getUserRosters();
            return result;
        } catch (error) {
            console.error('Errore nel caricamento dei roster:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Aggiorna un roster esistente
    updateRoster: async (rosterId, rosterData) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const updateData = {
                ...rosterData,
                updatedAt: new Date()
            };
            
            const result = await firestoreFunctions.updateDocument('rosters', rosterId, updateData);
            return result;
        } catch (error) {
            console.error('Errore nell\'aggiornamento del roster:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Elimina un roster
    deleteRoster: async (rosterId) => {
        try {
            const result = await firestoreFunctions.deleteDocument('rosters', rosterId);
            return result;
        } catch (error) {
            console.error('Errore nell\'eliminazione del roster:', error);
            return { success: false, error: error.message };
        }
    },
    
    // === GESTIONE AZIONI DI GIOCO ===
    
    // Salva le azioni di una partita
    saveMatchActions: async (matchId, actions) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const actionsData = {
                matchId: matchId,
                actions: actions,
                userId: user.uid,
                userEmail: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await firestoreFunctions.addDocument('match_actions', actionsData);
            return result;
        } catch (error) {
            console.error('Errore nel salvataggio delle azioni:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Carica le azioni di una partita
    loadMatchActions: async (matchId) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            // Qui dovremmo fare una query specifica per matchId
            // Per ora usiamo la funzione generica e filtriamo lato client
            const result = await firestoreFunctions.getDocuments('match_actions', user.uid);
            
            if (result.success) {
                const matchActions = result.documents.filter(doc => doc.matchId === matchId);
                return { success: true, documents: matchActions };
            }
            
            return result;
        } catch (error) {
            console.error('Errore nel caricamento delle azioni:', error);
            return { success: false, error: error.message };
        }
    },
    
    // === GESTIONE STATISTICHE ===
    
    // Salva le statistiche di una partita
    saveMatchStats: async (matchId, stats) => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                throw new Error('Utente non autenticato');
            }
            
            const statsData = {
                matchId: matchId,
                stats: stats,
                userId: user.uid,
                userEmail: user.email,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await firestoreFunctions.addDocument('match_stats', statsData);
            return result;
        } catch (error) {
            console.error('Errore nel salvataggio delle statistiche:', error);
            return { success: false, error: error.message };
        }
    },
    
    // === FUNZIONI DI UTILITÀ ===
    
    // Sincronizza i dati locali con Firestore
    syncLocalData: async () => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                return { success: false, error: 'Utente non autenticato' };
            }
            
            // Carica i dati dal localStorage
            const localMatches = JSON.parse(localStorage.getItem('matches') || '[]');
            const localRosters = JSON.parse(localStorage.getItem('rosters') || '[]');
            
            const syncResults = {
                matches: { synced: 0, errors: 0 },
                rosters: { synced: 0, errors: 0 }
            };
            
            // Sincronizza le partite
            for (const match of localMatches) {
                if (!match.synced) {
                    const result = await firestoreService.saveMatch(match);
                    if (result.success) {
                        match.synced = true;
                        match.firestoreId = result.id;
                        syncResults.matches.synced++;
                    } else {
                        syncResults.matches.errors++;
                    }
                }
            }
            
            // Sincronizza i roster
            for (const roster of localRosters) {
                if (!roster.synced) {
                    const result = await firestoreService.saveRoster(roster);
                    if (result.success) {
                        roster.synced = true;
                        roster.firestoreId = result.id;
                        syncResults.rosters.synced++;
                    } else {
                        syncResults.rosters.errors++;
                    }
                }
            }
            
            // Aggiorna il localStorage
            localStorage.setItem('matches', JSON.stringify(localMatches));
            localStorage.setItem('rosters', JSON.stringify(localRosters));
            
            return { success: true, syncResults };
        } catch (error) {
            console.error('Errore nella sincronizzazione:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Backup automatico dei dati
    autoBackup: async () => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                return { success: false, error: 'Utente non autenticato' };
            }
            
            // Ottieni tutti i dati locali
            const appState = {
                matches: JSON.parse(localStorage.getItem('matches') || '[]'),
                rosters: JSON.parse(localStorage.getItem('rosters') || '[]'),
                settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
                timestamp: new Date()
            };
            
            const backupData = {
                userId: user.uid,
                userEmail: user.email,
                appState: appState,
                createdAt: new Date()
            };
            
            const result = await firestoreFunctions.addDocument('backups', backupData);
            return result;
        } catch (error) {
            console.error('Errore nel backup automatico:', error);
            return { success: false, error: error.message };
        }
    }
};

// Funzioni di utilità per l'integrazione con l'app esistente
const integrationHelpers = {
    
    // Migra i dati esistenti da localStorage a Firestore
    migrateLocalStorageToFirestore: async () => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                alert('Devi essere autenticato per migrare i dati');
                return;
            }
            
            const result = await firestoreService.syncLocalData();
            
            if (result.success) {
                const { syncResults } = result;
                const message = `Migrazione completata:\n` +
                    `Partite sincronizzate: ${syncResults.matches.synced}\n` +
                    `Roster sincronizzati: ${syncResults.rosters.synced}\n` +
                    `Errori: ${syncResults.matches.errors + syncResults.rosters.errors}`;
                alert(message);
            } else {
                alert('Errore durante la migrazione: ' + result.error);
            }
        } catch (error) {
            console.error('Errore nella migrazione:', error);
            alert('Errore durante la migrazione dei dati');
        }
    },
    
    // Carica i dati da Firestore e li salva in localStorage
    loadFromFirestoreToLocal: async () => {
        try {
            const user = authFunctions.getCurrentUser();
            if (!user) {
                alert('Devi essere autenticato per caricare i dati');
                return;
            }
            
            // Carica partite
            const matchesResult = await firestoreService.loadUserMatches();
            if (matchesResult.success) {
                localStorage.setItem('matches', JSON.stringify(matchesResult.documents));
            }
            
            // Carica roster
            const rostersResult = await firestoreService.loadUserRosters();
            if (rostersResult.success) {
                localStorage.setItem('rosters', JSON.stringify(rostersResult.documents));
            }
            
            alert('Dati caricati da Firestore con successo!');
            
            // Ricarica la pagina per aggiornare l'interfaccia
            window.location.reload();
        } catch (error) {
            console.error('Errore nel caricamento da Firestore:', error);
            alert('Errore durante il caricamento dei dati');
        }
    }
};

// Esponi le funzioni globalmente
window.firestoreService = firestoreService;
window.integrationHelpers = integrationHelpers;