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

  beforeEach((done) => {
    // Generate a unique namespace for each test
    dbNamespace = "testdb_" + Date.now();
    setupDB(done, dbNamespace);
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

  test("we can update a contact", function (done) {
    addContact(contact2, function () {
      updateContact(1, { lastName: "the White" }, function () {
        getContacts(false, function (contacts) {
          console.log("contacts>>", contacts);
          expect(contacts).toEqual([{ ...contact2, lastName: "the White" }]);
          done();
        });
      });
    });
  });

  test("we can delete a contact", function (done) {
    addContact(contact1, function () {
      addContact(contact2, function () {
        deleteContact(1, function () {
          getContacts(false, function (contacts) {
            expect(contacts).toEqual([contact2]);
            done();
          });
        });
      });
    });
  });
});
