// Access source and target databases
const sourceDB = db.getSiblingDB("natours-test4");
const targetDB = db.getSiblingDB("natours-test5");

// Loop through each collection in the source DB
sourceDB.getCollectionNames().forEach((collName) => {
  console.log(`Copying collection: ${collName}`);

  // Optional: Drop the target collection if it exists
  targetDB[collName].drop();

  // Copy documents using aggregation with $out
  sourceDB[collName].aggregate([
    { $match: {} }, // Match all documents
    { $out: { db: "natours-test5", coll: collName } }, // Output to target DB
  ]);
});
