const request = require('supertest');
const app = require('../app');

describe('Rooms API', () => {
    it('should get a list of rooms', async () => {
        const res = await request(app)
            .get('/rooms/list').redirects(1);
        expect(res.statusCode).toEqual(200);
    });


    let roomId = 0;

    it('should create a new room', async () => {
        const newRoomData = {
            room_number: 104, // Assign a unique room number
            type_id: 2, // The type ID (this should correspond to a valid type in your room_type table)
            description: 'Deluxe double room with garden view',
            price: 95.00, // Set the price for the room
            beds: 2, // Number of beds in the room
            options: 'Wi-Fi, TV, Garden View' // List of options available in the room
        };

        const res = await request(app)
            .post('/rooms/create')
            .send(newRoomData);
        roomId = JSON.parse(res.text).id;
        expect(res.statusCode).toEqual(200);
    });

    it('should get a room by ID', async () => {
        
        const res = await request(app).get(`/rooms/${roomId}`);
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
            .put(`/rooms/${roomId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should delete a room', async () => {
        const res = await request(app).delete(`/rooms/${roomId}`);

        expect(res.statusCode).toEqual(200);
    });
});
