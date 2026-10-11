export const sendSuccess = (res, statusCode = 200, data = {}) => {
  return res.status(statusCode).json(data);
};
