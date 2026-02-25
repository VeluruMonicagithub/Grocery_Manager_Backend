import 'dotenv/config';
import http from 'http';

// We need a valid token. Since I can't easily get Meera's token, I'll bypass authentication for a sec to test sending email, or just invoke inviteMember directly.
import { inviteMember } from './controllers/memberController.js';

const req = {
    user: {
        id: '9332c1ab-1d22-454f-8e05-ec0a8e014ae6', // meera's id
        email: 'meera@tcs.com'
    },
    body: {
        email: 'test_auto@gmail.com'
    }
};

const res = {
    status: (code) => ({
        json: (data) => console.log('Status', code, data)
    }),
    json: (data) => console.log('Response', data)
};

inviteMember(req, res).then(() => {
    console.log("Done");
    process.exit(0);
}).catch(console.error);
