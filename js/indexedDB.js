const DB_NAME = "empleadosDB";
const STORE_NAME = "empleados";

let db;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e) => {
      db = e.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve();
    };

    request.onerror = reject;
  });
}

export function guardarCache(data) {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  data.forEach(item => store.put(item));
}

export function obtenerCache() {
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
  });
}
