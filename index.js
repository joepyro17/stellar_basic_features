const app = require('./server');

require('dotenv').config();

const port = process.env.PORT;

// Localhost
// app.listen(port, () => {
//   console.log(`Example app listening on port http://localhost:${port} \n`);
// });

// Server IP
const ip = '192.168.100.13';
app.listen(port, ip, () => {
   console.log(`Example app listening on port http://${ip}:${port} \n`);
});
