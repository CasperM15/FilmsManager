import express from 'express';

import filmsRouter from './delivery/routes/films';
import usersRouter from './delivery/routes/users';
import { ErrorHandler } from './domain/errors/error-handler';

require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.use('/api/films', filmsRouter);
app.use('/api/users', usersRouter);

app.use(ErrorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

