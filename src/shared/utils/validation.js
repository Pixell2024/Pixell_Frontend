// Function to check if the given URL is valid
function isValidURL(url) {
  const pattern = new RegExp(
    "(https://www.|http://www.|https://|http://)?[a-zA-Z0-9]{2,}(.[a-zA-Z0-9]{2,})(.[a-zA-Z0-9]{2,})?/[a-zA-Z0-9]{2,}"
    // "^(https?:\\/\\/)?" + // protocol
    // "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    //   "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    //   "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    //   "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    //   "(\\#[-a-z\\d_]*)?$",
    // "i"
  ); // fragment locator
  return !!pattern.test(url);
}

// Function to check if the given string is an integer
function isInteger(str) {
  const pattern = /^-?\d+$/;
  return pattern.test(str);
}

// Function to check if the given string is text (contains only letters)
function isText(str) {
  const pattern = /^[a-zA-Z\s]+$/;
  return pattern.test(str);
}

// Main validation function
export const validate = (value, type) => {
  switch (type) {
    case "url":
      return isValidURL(value);
    case "integer":
      return isInteger(value);
    case "text":
      return isText(value);
    default:
      return false;
  }
};

// Example usage:
// console.log(validate("https://www.example.com", "url")); // true
// console.log(validate("12345", "integer")); // true
// console.log(validate("Hello World", "text")); // true
// console.log(validate("12345abc", "integer")); // false
// console.log(validate("ftp://example.com", "url")); // false
