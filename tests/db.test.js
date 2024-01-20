require("fake-indexeddb/auto");
let {
  setupDB,
  addContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../src/services/db");

const contact1 = {
  firstName: "Frodo",
  lastName: "Baggins",
  email: "ringbearer@fellowship.org",
  phone: "1234567890",
};
const contact2 = {
  firstName: "Gandalf",
  lastName: "the Grey",
  email: "thegreypilgrim@fellowship.org",
  phone: "0987654321",
};

describe("Contacts Database Tests", () => {
  let dbNamespace;

  beforeEach(async () => {
    dbNamespace = "testdb_" + Date.now();
    await setupDB(dbNamespace);
  });

  afterEach(async () => {
    await indexedDB.deleteDatabase(dbNamespace);
  });

  test("we can store and retrieve contacts", async () => {
    await addContact(contact1);
    await addContact(contact2);
    const contacts = await getContacts(false);
    expect(contacts.map((c) => ({ ...c, id: undefined }))).toEqual([
      contact1,
      contact2,
    ]);
  });

  test("we can update a contact", async () => {
    const addedContact = await addContact(contact2);
    await updateContact(addedContact.id, { lastName: "the White" });
    const contacts = await getContacts(false);
    expect(contacts.find((c) => c.id === addedContact.id).lastName).toBe(
      "the White"
    );
  });

  test("we can delete a contact", async () => {
    const addedContact1 = await addContact(contact1);
    await addContact(contact2);
    await deleteContact(addedContact1.id);
    const contacts = await getContacts(false);
    expect(contacts).not.toContainEqual({ ...contact1, id: addedContact1.id });
  });
});
