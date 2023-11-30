import { add } from '#';

test('add 1 value', () => {
  expect(add(1)).toBe(1);
});

test('add 2 values', () => {
  expect(add(1, 2)).toBe(3);
});

test('add 3 values', () => {
  expect(add(1, 2, 3)).toBe(6);
});
