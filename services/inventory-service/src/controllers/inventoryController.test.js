const os = require('os');
const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const InventoryController = require('./inventoryController');

jest.setTimeout(30000);

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('InventoryController integration', () => {
  let mongoServer;
  let InventoryModel;
  let controller;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.5',
        downloadDir: path.join(os.tmpdir(), 'mongodb-binaries')
      }
    });
    await mongoose.connect(mongoServer.getUri(), { dbName: 'inventory-tests' });

    const inventorySchema = new mongoose.Schema({
      productId: String,
      stock: { type: Number, default: 0 }
    });

    InventoryModel = mongoose.model('InventoryTest', inventorySchema);
    controller = new InventoryController(InventoryModel);
  });

  afterEach(async () => {
    if (InventoryModel) {
      await InventoryModel.deleteMany({});
    }
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('decrements stock when product exists', async () => {
    await InventoryModel.create({ productId: 'prod-1', stock: 10 });
    const req = { body: { productId: 'prod-1', quantity: 3 } };
    const res = createResponse();

    await controller.updateStock(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0]).toEqual(
      expect.objectContaining({ productId: 'prod-1', stock: 7 })
    );
  });

  it('returns 404 when product does not exist', async () => {
    const req = { body: { productId: 'missing', quantity: 1 } };
    const res = createResponse();

    await controller.updateStock(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });
});
