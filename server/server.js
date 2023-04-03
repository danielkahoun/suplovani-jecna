const express = require('express')
const fs = require('fs')
const cors = require('cors');
const app = module.exports = express()

const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/assets', express.static(__dirname+'/../client/dist/assets'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

/** Web Routes (via Vue Router) */
app.get(['/','/login','/prehled','/uzivatele','/nastaveni'], (req, res) => {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(fs.readFileSync(__dirname+"/../client/dist/index.html"));
});

/** API Routes */
app.use('/ics', require('./routes/calendar'));
app.use('/api/login', require('./routes/login'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/substitutions', require('./routes/substitutions'));
app.use('/api/users', require('./routes/users'));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});