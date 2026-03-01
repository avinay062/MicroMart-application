import { selectProducts, selectLoading, selectError } from './productSelectors';

describe('product selectors', () => {
  const state = {
    products: {
      products: [{ id: 1, name: 'Laptop' }],
      loading: true,
      error: 'Boom'
    }
  };

  it('selectProducts returns product list', () => {
    expect(selectProducts(state)).toEqual(state.products.products);
  });

  it('selectLoading returns loading flag', () => {
    expect(selectLoading(state)).toBe(true);
  });

  it('selectError returns error message', () => {
    expect(selectError(state)).toBe('Boom');
  });
});
