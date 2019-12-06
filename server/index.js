import express from 'express';

import serverRenderer from './middleware/renderer';

const PORT = process.env.PORT || 8000;
const path = require('path');

const app = express();

app.get('/', serverRenderer);
app.get('/img/camp-nou', (req, res, next) => {
    const filePath = path.resolve('server/middleware/campnou.jpg');
    return res.sendFile(filePath);
});
app.use(express.static(path.resolve('dist')));

app.listen(PORT, error => {
    if (error) {
        return console.log('Could not start the app', error);
    }

    console.log('Listening on ' + PORT + '...');
});
