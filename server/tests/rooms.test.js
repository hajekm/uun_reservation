const request = require('supertest');
const app = require('../app');

describe('Rooms API', () => {
    it('should get a list of rooms', async () => {
        const res = await request(app)
            .get('/api/rooms/list').redirects(1);
        expect(res.statusCode).toEqual(200);
    });


    let roomId = 0;

    it('should create a new room', async () => {
        const newRoomData = {
            room_number: 154,
            type_id: 2,
            description: 'Deluxe double room with garden view',
            price: 95.00,
            beds: 2,
            options: 'Wi-Fi, TV, Garden View'
        };

        const res = await request(app)
            .post('/api/rooms/create')
            .send(newRoomData);
        roomId = res._body.id;
        expect(res.statusCode).toEqual(200);
    });

    it('should get a room by ID', async () => {
        const res = await request(app).get(`/api/rooms/${roomId}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should update a room', async () => {

        const updatedData = {
            room_number: 135,
            type_id: 2,
            description: 'Deluxe edited text',
            options: 'Wi-Fi, TV, Garden View, Whirpool'
        };

        const res = await request(app)
            .put(`/api/rooms/${roomId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should delete a room', async () => {
        const res = await request(app).delete(`/api/rooms/${roomId}`);

        expect(res.statusCode).toEqual(200);
    });

    it('should get a list of available rooms', async () => {
        const startDate = '2024-01-13T00:00:00Z';
        const endDate = '2024-01-14T00:00:00Z';

        const res = await request(app)
            .get(`/api/rooms/available?start=${startDate}&end=${endDate}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
