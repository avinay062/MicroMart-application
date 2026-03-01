import reducer, {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure
} from './productSlice';

describe('productSlice reducer', () => {
  it('marks loading true on fetchProductsStart', () => {
    const state = reducer(undefined, fetchProductsStart());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores products on fetchProductsSuccess', () => {
    const mockProducts = [{ id: 1, name: 'Phone' }];
    const state = reducer(undefined, fetchProductsSuccess(mockProducts));
    expect(state.loading).toBe(false);
    expect(state.products).toEqual(mockProducts);
  });

  it('stores errors on fetchProductsFailure', () => {
    const error = 'Network error';
    const state = reducer(undefined, fetchProductsFailure(error));
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});
