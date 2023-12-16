# uun_reservation

# Backend

How to run:

1. Install mysql database to your localhost or docker
2. Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator and add there new
   line: `127.0.0.1 reservations.echovo.cz`
3. Copy config/config.temp.js to config/config.js and set your database details as well as google auth details
4. Move to the server directory `cd server`
5. Run `npm install`
6. Run `npm run generate` to generate your database schema and demo data
7. Run `npm run test` to run test suite
8. Run `npm start` to start the app (server should be accessible at reservations.echovo.cz:3001)
