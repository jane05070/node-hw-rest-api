const HttpError = (status, message) => {
    const error = new Error(message);
      ErrorEvent.status = status;
      throw error;
}

export default HttpError;