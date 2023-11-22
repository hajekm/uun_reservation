const request = require('supertest');
const app = require('../app');

let reservationId = 0;

describe('Reservations API', () => {
    it('should create a new reservation', async () => {
        const newReservationData = {
            user_id: 1,
            room_id: 1,
            start_date: '2024-01-01',
            end_date: '2023-01-05',
            state_id: 1
        };

        const res = await request(app)
            .post('/reservations/create')
            .send(newReservationData);

        expect(res.statusCode).toEqual(200);
        reservationId = JSON.parse(res.text).id;
    });

    it('should get a list of reservations', async () => {
        const res = await request(app).get('/reservations/list'); // Adjust this endpoint
        expect(res.statusCode).toEqual(200);
    });

    it('should get a reservation by ID', async () => {
        const res = await request(app).get(`/reservations/${reservationId}`); // Adjust this endpoint
        expect(res.statusCode).toEqual(200);
    });

    it('should update a reservation', async () => {
        const updatedData = {
            start_date: '2022-01-02',
            end_date: '2022-01-06'
        };

        const res = await request(app)
            .put(`/reservations/${reservationId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should change status of reservation', async () => {
        const updatedData = {
            state_id: 3
        };

        const res = await request(app)
            .put(`/reservations/state/${reservationId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should delete a reservation', async () => {
        const res = await request(app).delete(`/reservations/${reservationId}`);
        expect(res.statusCode).toEqual(200);
    });
});
