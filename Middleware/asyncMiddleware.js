//this is try catch template with handler as argument which is a function which will execute code to be performed on that route
//thanks mosh
//checkout genres

module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};
