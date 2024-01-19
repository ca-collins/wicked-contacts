let db;
let dbNamespace;
let dbNameStr = "wickedContacts";
let dbStoreNameStr = "contacts";

function setupDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    let dbName = dbNameStr;
    let dbReq = indexedDB.open(dbName, 2);

    dbReq.onupgradeneeded = function (event) {
      db = event.target.result;
      if (!db.objectStoreNames.contains(dbStoreNameStr)) {
        db.createObjectStore(dbStoreNameStr, { autoIncrement: true });
      }
    };

    dbReq.onsuccess = function (event) {
      db = event.target.result;
      resolve(db);
    };

    dbReq.onerror = function (event) {
      reject("error opening database " + event.target.errorCode);
    };
  });
}

function addContact(contact) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction([dbStoreNameStr], "readwrite");
    let store = tx.objectStore(dbStoreNameStr);

    let request = store.add({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
    });

    request.onsuccess = function (event) {
      const id = event.target.result;
      store.get(id).onsuccess = function (event) {
        contact = event.target.result;
        contact.id = id;
        resolve(contact); // Resolve with the full contact object
      };
    };

    request.onerror = function (event) {
      reject("error storing contact " + event.target.errorCode);
    };
  });
}

function getContacts(reverseOrder) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction([dbStoreNameStr], "readonly");
    let store = tx.objectStore(dbStoreNameStr);
    let req = store.openCursor(null, reverseOrder ? "prev" : "next");

    let allContacts = [];
    req.onsuccess = function (event) {
      let cursor = event.target.result;

      if (cursor != null) {
        let contact = cursor.value;
        contact.id = cursor.key;
        allContacts.push(cursor.value);
        cursor.continue();
      } else {
        resolve(allContacts);
      }
    };

    req.onerror = function (event) {
      reject("error in cursor request " + event.target.errorCode);
    };
  });
}

function updateContact(id, updatedContact) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction([dbStoreNameStr], "readwrite");
    let store = tx.objectStore(dbStoreNameStr);

    let req = store.get(id);
    req.onsuccess = function (event) {
      let existingContact = event.target.result;
      if (existingContact) {
        // Apply updates to the existing contact
        applyUpdates(existingContact, updatedContact);
        store.put(existingContact, id).onsuccess = function () {
          resolve(existingContact); // Resolve with the updated contact
        };
      } else {
        reject("Contact not found");
      }
    };

    req.onerror = function (event) {
      reject("error updating contact " + event.target.errorCode);
    };
  });
}

function applyUpdates(original, updates) {
  for (let key in updates) {
    if (updates.hasOwnProperty(key) && updates[key] !== undefined) {
      original[key] = updates[key];
    }
  }
}

function deleteContact(id) {
  return new Promise((resolve, reject) => {
    let tx = db.transaction([dbStoreNameStr], "readwrite");
    let store = tx.objectStore(dbStoreNameStr);

    let request = store.delete(id);

    request.onsuccess = function () {
      resolve(); // Resolving without a value, as delete doesn't return a value
    };

    request.onerror = function (event) {
      reject("error deleting contact " + event.target.errorCode);
    };
  });
}

export { setupDB, addContact, getContacts, updateContact, deleteContact };
