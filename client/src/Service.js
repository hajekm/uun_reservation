const url = "http://localhost:8000";

export class ReservationService {
  static getUser(id) {
    return fetch(`${url}/user/${id}`).then((res) => res.json());
  }

  static getUsers() {
    return JSON.parse(
      '[{"id":"211b9b5b-bee0-443c-b94c-c94c93c6b998", "email":"user1@gmail.com", "role":"SuperUser"},{"id":"25df8c45-1d86-44bd-b956-24e1efa6f4ab", "email":"user2@gmail.com", "role":"User"},{"id":"41937963-5f22-4236-936f-b2fe67c4e9c5", "email":"user3@gmail.com", "role":"Admin"}]'
    );
    // return fetch(`${url}/user`).then((res) => res.json());
  }

  static deleteUser(id) {
    return fetch(`${url}/user/${id}`, { method: "DELETE" }).then(
      (res) => res.status
    );
  }

  static getUsers() {
    return fetch(`${url}/user`).then((res) => res.json());
  }

  static postUser(values) {
    return fetch(`${url}/user`, {
      method: "POST",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
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
