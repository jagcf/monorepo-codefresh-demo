import * as express from 'express';
import {healthcheck} from '@vgw-lib/server-base';

const app = express();
const symbols = ['1', '2', '3', '4', '5'];

app.get('/healthcheck', healthcheck);

app.get('/play', (req, res) => {

    let reels = [];

    for(let i = 0; i < 3; i++) {
        let reel = [];
        for(let j = 0; j < 3; j++) {
            reel.push(symbols[Math.floor(Math.random() * symbols.length)])
        }

        reels.push(reel);
    }

    res.send(reels.map(r => r.join()).join("\n"));
});

const server = app.listen(8002, () => {
    console.log('Game 2 listening on port 8002');
})
