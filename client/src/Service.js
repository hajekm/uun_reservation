const url = "http://localhost:3001";

export class ReservationService {
    // static getAuth() {
    //     return fetch(`${url}/auth`, {
    //         method: 'GET',
    //         credentials: 'include', // Important for cookies/session
    //     });
    // }

    static getUserInfo() {
        return fetch(`${url}/users/info`,{
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }
    static getUsers() {
        return fetch(`${url}/users/list`,{
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static deleteUser(id) {
        return fetch(`${url}/users/${id}`, {method: "DELETE"});
    }

    static getReservations() {
        return fetch(`${url}/reservations/list`,{
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static getRooms() {
        return fetch(`${url}/rooms/list`,{
            method: 'GET',
            credentials: 'include', // Important for cookies/session
        });
    }

    static postUser(values) {
        return fetch(`${url}/users/create`, {
            method: "POST",
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
            body: JSON.stringify(values, null, 2),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((res) => res);
    }
}
