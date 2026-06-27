const DB_NAME = 'tahperaislcfeonodlesd';
const STORE_NAME = 'tahperaislcfeonodlesd';
const KEY = 'tahperaislcfeonodlesd';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function local_save() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(player.save(), KEY);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

async function local_load() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(KEY);
        req.onsuccess = () => {
            const data = req.result;
            if (data !== undefined) {
                player.load(data);
            }
            resolve();
        };
        req.onerror = () => reject(req.error);
    });
}

async function hard_reset(seed) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(KEY);
        req.onsuccess = () => {
            player.reset(seed);
            player.current_layer.selectLayer();
            resolve();
        };
        req.onerror = () => reject(req.error);
    });
}

async function import_save() {
    player.load(JSON.parse(atob(await navigator.clipboard.readText())));
}

function export_save() {
    navigator.clipboard.writeText(btoa(JSON.stringify(player.save())));
}

function exportToClipboard() {
    navigator.clipboard.writeText(document.getElementById('export_save').value);
}

function importFromClipboard() {
    navigator.clipboard.readText().then(clipText => document.getElementById('import_save').value = clipText);
}

function importSave() {
    let backup = player.save();
    try {
        player.load(JSON.parse(atob(document.getElementById('import_save').value)));
        closeModal();
    } catch (e) {
        player.load(backup);
    }
}
