const { add, substract } = require('./sum-example.js');

// Common initial data for the tests
let num1;
let num2;

// Execute before all tests
beforeAll(() => {
  num1 = 5;
  num2 = 3;
  console.log('Setting up initial data for the tests');
});

// Execute before each test
beforeEach(() => {
  console.log('Preparing for a new test');
});

// Execute after each test
afterEach(() => {
  console.log('Cleaning up after a test');
});

// Execute after all tests
afterAll(() => {
  console.log('Performing overall cleanup after all tests');
});

describe('Calculator functions', () => {
  it('should add two numbers', () => {
    const result = add(num1, num2);
    expect(result).toBe(8);
    console.log('Tested addition function');
  });

  it('should subtract two numbers', () => {
    const result = substract(num1, num2);
    expect(result).toBe(2);
    console.log('Tested subtraction function');
  });
});
