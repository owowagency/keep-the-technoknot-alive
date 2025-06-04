import bodyParser from 'body-parser';
import express  from 'express';
import {commands} from './commands/index.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async(req, res) => {
    const text = req.body.text;

    if (text in commands) {
        const command = commands[text];

        command();
    } else {
        return res.json({
            response_type: 'in_channel',
            text: 'I do nut understent joe!',
        });
    }

    return res.json({
        response_type: 'in_channel',
        text: 'thanks',
    });
})

app.listen(6969);
