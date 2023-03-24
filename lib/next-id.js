let currentId = 0;

let nextId = () => {
  currentId += 1;
  console.log("GENERATED ID = " + currentId);
  return currentId;
};

module.exports = nextId;