const request = require('supertest');
const app = require('../app');

let reservationId = 0;

describe('Reservations API', () => {
    it('should create a new reservation', async () => {
        const newReservationData = {
            room_id: 1,
            start_date: '2024-01-01',
            end_date: '2023-01-05'
        };

        const res = await request(app)
            .post('/api/reservations/create')
            .send(newReservationData);

        expect(res.statusCode).toEqual(200);
        reservationId = res._body.id;
    });

    it('should get a list of reservations', async () => {
        const res = await request(app).get('/api/reservations/list');
        expect(res.statusCode).toEqual(200);
    });

    it('should get a reservation by ID', async () => {
        const res = await request(app).get(`/api/reservations/${reservationId}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should get reservations for a specific user', async () => {
        const userId = 1;
        const res = await request(app).get(`/api/reservations/user/${userId}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should update a reservation', async () => {
        const updatedData = {
            start_date: '2022-01-02',
            end_date: '2022-01-06'
        };

        const res = await request(app)
            .put(`/api/reservations/${reservationId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should change status of reservation', async () => {
        const updatedData = {
            state_id: 3
        };

        const res = await request(app)
            .put(`/api/reservations/state/${reservationId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
    });

    it('should delete a reservation', async () => {
        const res = await request(app).delete(`/api/reservations/${reservationId}`);
        expect(res.statusCode).toEqual(200);
    });
});
