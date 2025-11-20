// Access source and target databases
const sourceDB = db.getSiblingDB("natours-test1");
const targetDB = db.getSiblingDB("natours-test2");

// Loop through each collection in the source DB
sourceDB.getCollectionNames().forEach((collName) => {
  console.log(`Copying collection: ${collName}`);

  // Optional: Drop the target collection if it exists
  targetDB[collName].drop();

  // Copy documents using aggregation with $out
  sourceDB[collName].aggregate([
    { $match: {} }, // Match all documents
    { $out: { db: "natours-test2", coll: collName } }, // Output to target DB
  ]);
});
