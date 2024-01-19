const dbName = "WickedContacts";
const storeName = "Contacts";

// Open (or create) the database
const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      contactStore = db.createObjectStore(storeName, {
        autoIncrement: true,
      });
      contactStore.createIndex("firstNameIndex", "firstName", {
        unique: false,
      });
      contactStore.createIndex("lastNameIndex", "lastName", {
        unique: false,
      });
    };

    request.onerror = (event) => reject(event.target.errorCode);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

// Add a contact
const addContact = async (contact) => {
  try {
    validateContact(contact); // Throws error if validation fails
    const db = await openDB();
    const transaction = db.transaction(["Contacts"], "readwrite");
    const store = transaction.objectStore("Contacts");
    return store.add(contact);
  } catch (error) {
    console.error("Failed to add contact:", error);
    throw error; // or handle it as needed
  }
};

// Other CRUD operations (read, update, delete) go here...

export { addContact /*, other exported functions */ };

function validateContact(contact) {
  const allowedFields = ["firstName", "lastName", "email", "phoneNumber"];
  const invalidFields = Object.keys(contact).filter(
    (field) => !allowedFields.includes(field)
  );
  if (invalidFields.length) {
    throw new Error(
      `Validation error: Invalid contact fields: ${invalidFields.join(", ")}`
    );
  }
  const requiredFields = ["firstName", "lastName", "email", "phoneNumber"];
  const isValid = requiredFields.every((field) => field in contact);

  if (!isValid) {
    throw new Error("Validation error: Missing required contact fields");
  }

  return true;
}
