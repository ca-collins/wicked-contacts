module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  setupFiles: ["fake-indexeddb/auto"],
};
