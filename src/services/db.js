let db;
let dbNamespace;
let dbNameStr = "wickedContacts";
let dbStoreNameStr = "contacts";

function setupDB(namespace, callback) {
  if (namespace != dbNamespace) {
    db = null;
  }
  dbNamespace = namespace;

  if (db) {
    callback();
    return;
  }

  let dbName = namespace == "" ? dbNameStr : dbNameStr + "_" + namespace;
  let dbReq = indexedDB.open(dbName, 2);

  dbReq.onupgradeneeded = function (event) {
    db = event.target.result;

    let contacts;
    if (!db.objectStoreNames.contains(dbStoreNameStr)) {
      contacts = db.createObjectStore(dbStoreNameStr, { autoIncrement: true });
    } else {
      contacts = dbReq.transaction.objectStore(dbStoreNameStr);
    }
  };

  dbReq.onsuccess = function (event) {
    db = event.target.result;
    callback();
  };

  dbReq.onerror = function (event) {
    alert("error opening database " + event.target.errorCode);
  };
}

function addContact(contact, callback) {
  let tx = db.transaction([dbStoreNameStr], "readwrite");
  let store = tx.objectStore(dbStoreNameStr);

  store.add({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  });

  tx.oncomplete = callback;
  tx.onerror = function (event) {
    alert("error storing contact " + event.target.errorCode);
  };
}

function getContacts(reverseOrder, callback) {
  let tx = db.transaction([dbStoreNameStr], "readonly");

  let store = tx.objectStore(dbStoreNameStr);
  let req = store.openCursor(null, reverseOrder ? "prev" : "next");

  let allContacts = [];
  req.onsuccess = function (event) {
    let cursor = event.target.result;

    if (cursor != null) {
      allContacts.push(cursor.value);
      cursor.continue();
    } else {
      callback(allContacts);
    }
  };

  req.onerror = function (event) {
    alert("error in cursor request " + event.target.errorCode);
  };
}

module.exports = { setupDB, addContact, getContacts };
