const request = require('supertest');
const app = require('../app');

let userId = 0;

describe('Users API', () => {
    it('should create a new user', async () => {
        const newUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            role_id: 1
        };

        const res = await request(app)
            .post('/users/create')
            .send(newUser);

        expect(res.statusCode).toEqual(200);
        userId = res._body.id;
    });

    it('should get a list of users', async () => {
        const res = await request(app).get('/users/list');
        expect(res.statusCode).toEqual(200);
    });

    it('should get a user by ID', async () => {
        const res = await request(app).get(`/users/${userId}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should update a user', async () => {
        const updatedData = {
            username: 'updateduser',
            email: 'updateduser@example.com'
        };

        const res = await request(app)
            .put(`/users/${userId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should delete a user', async () => {
        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toEqual(200);
    });
});