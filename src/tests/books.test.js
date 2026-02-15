const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../app');
const User = require('../models/user.model');
const Book = require('../models/book.model');

jest.mock('../utils/email', () => ({
    sendEmail: jest.fn(() => Promise.resolve())
}));

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany();
    await Book.deleteMany();
});

test('POST /books → crear libro', async () => {
    const user = await User.create({ email: 'a@test.com', password: '123456' });
    const token = 'Bearer ' + jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');

    const res = await request(app)
        .post('/books')
        .set('Authorization', token)
        .send({ title: 'Libro Test', description: 'Desc', price: 10, author: 'Autor' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Libro Test');
});

test('GET /books → obtener libros publicados', async () => {
    const user = await User.create({ email: 'b@test.com', password: '123456' });
    await Book.create({ title: 'Libro Test', description: 'Desc', price: 10, author: 'Autor', ownerId: user._id, status: 'PUBLISHED' });
    const token = 'Bearer ' + jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');

    const res = await request(app)
        .get('/books')
        .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.books.length).toBeGreaterThan(0);
});

test('POST /books/:id/buy → comprar libro', async () => {
    const seller = await User.create({ email: 'seller@test.com', password: '123456' });
    const book = await Book.create({ title: 'Libro Compra', description: 'Desc', price: 10, author: 'Autor', ownerId: seller._id, status: 'PUBLISHED' });

    const buyer = await User.create({ email: 'buyer@test.com', password: '123456' });
    const buyerToken = 'Bearer ' + jwt.sign({ id: buyer._id }, process.env.JWT_SECRET || 'secret');

    const res = await request(app)
        .post(`/books/${book._id}/buy`)
        .set('Authorization', buyerToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SOLD');
});
