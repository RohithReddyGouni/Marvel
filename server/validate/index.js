let validateNumber = async (num) => {
  if (!num) {
    throw "Invalid number, please enter a number";
  }
  if (typeof num === "string") {
    if (num != parseInt(num)) {
      throw "Invalid number, please enter a number";
    }
  }
  num = parseInt(num);
  if (isNaN(num)) {
    throw "Invalid number, please enter a number";
  }
  if (num <= 0) {
    throw "Invalid number, please enter a positive number";
  }
  return true;
};

let validateString = async (str) => {
  if (!str) {
    throw "Invalid string, please enter a string";
  }
  if (typeof str !== "string") {
    throw "Invalid string, please enter a string";
  }
  str = str.trim();
  if (str.length === 0) {
    throw "Invalid string, please enter a string";
  }
  return true;
};

module.exports = {
  validateNumber,
  validateString,
};
