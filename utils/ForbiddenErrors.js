class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

export default ForbiddenError;
