const mysql = require('mysql2/promise');
const config = require('../config/config');

mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password
}).then(async (connection) => {
    console.log("Creating database");
    await connection.query('CREATE DATABASE IF NOT EXISTS ' + config.database.dbName + ';');

    await connection.query('USE ' + config.database.dbName + ';');


    console.log("Creating schemas");
    const createUserTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            role_id INT,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            revision INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES user_role(id)
        );
    `;

    const createRoomsTableSql = `
        CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            room_number INT NOT NULL UNIQUE,
            type_id int,
            description VARCHAR(1000),
            price DECIMAL(10, 2),
            beds INT,
            options VARCHAR(255),
            revision INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (type_id) REFERENCES room_type(id)
        );
    `;

    const createReservationsTableSql = `
        CREATE TABLE IF NOT EXISTS reservations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            room_id INT,
            start_date DATE,
            end_date DATE,
            state_id INT,
            revision INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id),
            FOREIGN KEY (state_id) REFERENCES reservation_state(id)
        );
    `;


    const createUserRoleTableSql = `
        CREATE TABLE IF NOT EXISTS user_role (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    const createRoomTypeTableSql = `
        CREATE TABLE IF NOT EXISTS room_type (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    const createReservationStateTableSql = `
        CREATE TABLE IF NOT EXISTS reservation_state (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    const createRevisionsTableSql = `
        CREATE TABLE revisions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            model VARCHAR(255) NOT NULL,
            document JSON NOT NULL,
            operation VARCHAR(255) NOT NULL,
            documentId INT NOT NULL,
            revision INT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    await connection.query(createRevisionsTableSql);
    await connection.query(createUserRoleTableSql);
    await connection.query(createRoomTypeTableSql);
    await connection.query(createReservationStateTableSql);
    await connection.query(createUserTableSql);
    await connection.query(createRoomsTableSql);
    await connection.query(createReservationsTableSql);


    console.log("Schema created, inserting default values");

    const insertUserRolesSql = `
        INSERT INTO user_role (name) VALUES 
        ('Admin'), 
        ('Manager'), 
        ('User');
    `;
    await connection.query(insertUserRolesSql);

    // Insert room types into the room_type table
    const insertRoomTypesSql = `
        INSERT INTO room_type (name) VALUES 
        ('Single'), 
        ('Double'), 
        ('Suite');
    `;
    await connection.query(insertRoomTypesSql);

    const insertReservationStatesSql = `
        INSERT INTO reservation_state (name) VALUES 
        ('New'), 
        ('Confirmed'), 
        ('Canceled');
    `;
    await connection.query(insertReservationStatesSql);

    const insertRoomsSql = `
    INSERT INTO rooms (room_number, type_id, description, price, beds, options) VALUES 
    (101, 1, 'Single room with basic amenities', 50.00, 1, 'Wi-Fi, TV'),
    (102, 2, 'Double room with sea view', 80.00, 2, 'Wi-Fi, TV, Balcony'),
    (103, 3, 'Luxury suite with panoramic view', 150.00, 2, 'Wi-Fi, TV, Balcony, Minibar');
    `;
    await connection.query(insertRoomsSql);

    const insertTestUserSql = `
    INSERT INTO users (role_id, username, email) VALUES 
    (1, 'Test user', 'testuser@test.test');
    `;
    await connection.query(insertTestUserSql);

    console.log("Database and tables created successfully");

    await connection.end();
}).catch(error => {
    console.error('Failed to create database or tables:', error);
});