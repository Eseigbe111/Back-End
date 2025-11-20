// ✅ The Function (with a bug)
// This function should take an array of numbers and return only the even numbers, sorted in ascending order.
// But there is one mistake inside.
function getSortedEvenNumbers(numbers) {
  debugger; // <-- You will use this to debug

  // Should filter even numbers and sort them
  const evens = numbers.filter((num) => num % 2 === 2); // BUG ❌ (should detect even, not odd)

  return evens.sort((a, b) => a - b);
}

// Test
const result = getSortedEvenNumbers([10, 3, 5, 8, 2, 9]);
console.log(result);
