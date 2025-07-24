export default (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    };

    // Safely check for request body
    if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET') {
      logEntry.body = req.body;
    }

    console.log(JSON.stringify(logEntry, null, 2));
  });
  
  next();
};