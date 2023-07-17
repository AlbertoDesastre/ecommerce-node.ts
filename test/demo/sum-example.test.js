const sum = require('./sum-example');

test('adds 1 + 2', () => {
  expect(sum(1, 2)).toBe(3);
});
