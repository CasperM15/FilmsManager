import express from 'express';
import { NextFunction, Request, Response } from 'express';
import { BadRequest, Conflict, NotFound, Unauthorized } from './errors';

export const ErrorHandler: express.ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof BadRequest) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof Unauthorized) {
    return res.status(401).json({ error: err.message });
  }
  if (err instanceof NotFound) {
     return res.status(404).json({ error: err.message });
  }
  if (err instanceof Conflict) {
    return res.status(409).json({ error: err.message });
  }
  
  console.error(err.stack);
   return res.status(500).json({ error: 'Internal Server Error' });
};