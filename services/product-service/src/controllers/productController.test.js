import ProductController from './productController';
import productService from '../services/productService';

jest.mock('../services/productService', () => ({
  __esModule: true,
  default: {
    createProduct: jest.fn(),
    getAllProducts: jest.fn()
  }
}));

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ProductController', () => {
  let controller;

  beforeEach(() => {
    controller = new ProductController();
    jest.clearAllMocks();
  });

  it('returns 201 when product creation succeeds', async () => {
    const mockProduct = { product: { id: 'prod-1' } };
    productService.createProduct.mockResolvedValue(mockProduct);
    const req = {
      body: { name: 'Phone', price: 999, description: 'Flagship' },
      file: { buffer: Buffer.from('image-bytes') }
    };
    const res = createResponse();

    await controller.createProduct(req, res);

    expect(productService.createProduct).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: 'Phone' })
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product created successfully',
      product: mockProduct.product
    });
  });

  it('returns service error status when productService throws controlled error', async () => {
    const error = Object.assign(new Error('Validation failed'), { status: 400 });
    productService.createProduct.mockRejectedValue(error);
    const req = {
      body: { name: '', price: 0, description: '' },
      file: null
    };
    const res = createResponse();

    await controller.createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed' });
  });
});
