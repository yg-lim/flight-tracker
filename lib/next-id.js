let id = 0;

module.exports = function nextId() {
  id += 1;
  return id;
};