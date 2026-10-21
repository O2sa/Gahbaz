export const sendSuccess = (res, data = {}, statusCode = 200, meta = null) => {
  const payload = {
    success: true,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
};

export const sendCreated = (res, data = {}) => {
  return sendSuccess(res, data, 201);
};

export const sendNoContent = (res) => {
  return res.status(204).send();
};

export const sendPaginated = (res, data = [], meta = {}) => {
  return sendSuccess(res, data, 200, meta);
};
