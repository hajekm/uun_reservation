const url = "http://reservations.echovo.cz";

export class ReservationService {
  static getAuth() {
    return fetch(`${url}/auth`);
  }

  static getUsers() {
    return fetch(`${url}/users/list`);
  }

  static deleteUser(id) {
    return fetch(`${url}/user/${id}`, { method: "DELETE" }).then(
      (res) => res.status
    );
  }

  static loginUser(values) {
    return fetch(`${url}/user/login`, {
      method: "POST",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
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
