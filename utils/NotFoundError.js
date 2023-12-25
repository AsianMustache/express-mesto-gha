class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

export default NotFoundError;
