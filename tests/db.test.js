require("fake-indexeddb/auto");
let { setupDB, addContact, getContacts } = require("../src/services/db");

const contact1 = {
  firstName: "Frodo",
  lastName: "Baggins",
  email: "ringbearer@fellowship.org",
  phone: "1234567890",
};
const contact2 = {
  firstName: "Samwise",
  lastName: "Gamgee",
  email: "therealmvp@fellowship.org",
  phone: "0987654321",
};

describe("Contacts Database Tests", () => {
  let dbNamespace;

  beforeEach((done) => {
    // Generate a unique namespace for each test
    dbNamespace = "testdb_" + Date.now();
    setupDB(dbNamespace, done);
  });

  afterEach((done) => {
    // Clean up: Drop the database after each test
    let req = indexedDB.deleteDatabase(dbNamespace);
    req.onsuccess = () => done();
    req.onerror = () => done.fail("Error clearing database");
  });

  test("we can store and retrieve contacts", function (done) {
    addContact(contact1, function () {
      addContact(contact2, function () {
        getContacts(false, function (contacts) {
          expect(contacts).toEqual([contact1, contact2]);
          done();
        });
      });
    });
  });

  test("we can store contacts and retrieve them in reverse order", function (done) {
    addContact(contact1, function () {
      addContact(contact2, function () {
        getContacts(true, function (contacts) {
          expect(contacts).toEqual([contact2, contact1]);
          done();
        });
      });
    });
  });
});
