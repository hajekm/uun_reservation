const nodemailer = require('nodemailer');
const config = require('../config/config');

function sendReservationEmail(user, reservation) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.mailer.username,
            pass: config.mailer.password
        }
    });

    let mailOptions = {
        from: 'martinpalas89@gmail.com',
        to: user.email,
        subject: 'Reservation confirmation',
        text: 'Reservation confirmed! for room number '
            + reservation.room_id
            + ' from '
            + reservation.start_date
            + ' to '
            + reservation.end_date
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            return;
        }
       // console.log('Email sent:', info.response);
    });
}

function sendCancelReservationEmail(user, room, start_date, end_date) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.mailer.username,
            pass: config.mailer.password
        }
    });

    let mailOptions = {
        from: 'martinpalas89@gmail.com',
        to: user.email,
        subject: 'Reservation canceled!',
        text: 'Reservation canceled! for room number '
            + room
            + ' from '
            + start_date
            + ' to '
            + end_date
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            return;
        }
       //console.log('Email sent:', info.response);
    });
}

module.exports = { sendReservationEmail, sendCancelReservationEmail };
