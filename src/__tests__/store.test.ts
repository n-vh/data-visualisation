import { describe, expect, it } from 'vitest';
import { createStore } from '../store';

describe('createStore', () => {
  const store = createStore(1, ({ set, update }) => ({
    increment: () => update((v) => v + 1),
    reset: () => set(0),
  }));

  it('gets the store value', () => {
    expect(store.get()).toBe(1);
  });

  it('sets the store value', () => {
    expect(store.set(10)).toBe(10);
  });

  it('updates the store value', () => {
    expect(store.update((v) => v + 5)).toBe(15);
  });

  it('increments the value using a custom method', () => {
    expect(store.increment()).toBe(16);
  });

  it('resets the value using a custom method', () => {
    expect(store.reset()).toBe(0);
  });
});
