export const Errors = {
    NOT_FOUND: 'NotFound',
};

export class NotFound extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NotFound';
    }
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
  }
}

export class Conflict extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Conflict';
  }
}

export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
  }
}