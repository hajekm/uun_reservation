const url = "http://reservations.echovo.cz/api";

export class ReservationService {
    static getUserReservations(userId) {
        return fetch(`${url}/reservations/user/${userId}`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static getUserInfo() {
        return fetch(`${url}/users/getInfo`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static getUsers() {
        return fetch(`${url}/users/list`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static getUser(userId) {
        return fetch(`${url}/users/${userId}`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static deleteUser(id) {
        return fetch(`${url}/users/${id}`, {method: "DELETE", credentials: 'include',});
    }

    static deleteReservation(id) {
        return fetch(`${url}/reservations/${id}`, {method: "DELETE", credentials: 'include',});
    }

    static getReservations() {
        return fetch(`${url}/reservations/list`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static getRooms() {
        return fetch(`${url}/rooms/list`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static getAvailableRooms(values) {
        return fetch(`${url}/rooms/available?start=${values.start_date}&end=${values.end_date}`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session

        });
    }

    static postUser(values) {
        return fetch(`${url}/users/create`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(values, null, 2),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    }

    static postReservation(values) {
        return fetch(`${url}/reservations/create`, {
            method: "POST",
            body: JSON.stringify(values, null, 2),
            credentials: 'include',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    }

    static putUser(values) {
        return fetch(`${url}/user/${values.id}`, {
            method: "PUT",
            credentials: 'include',
            body: JSON.stringify(values, null, 2),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((res) => res);
    }

    //Matěj

    static deleteRoom(id) {
        return fetch(`${url}/rooms/${id}`, {method: "DELETE", credentials: 'include',});
    }

    static postRoom(values) {
        return fetch(`${url}/rooms/create`, {
            method: "POST",
            body: JSON.stringify(values, null, 2),
            credentials: 'include',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    }

    static putRoom(values) {
        return fetch(`${url}/rooms/${values.id}`, {
            method: "PUT",
            body: JSON.stringify(values, null, 2),
            credentials: 'include',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    }

    static getAuditLog() {
        return fetch(`${url}/revisions/list`, {
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }
}
