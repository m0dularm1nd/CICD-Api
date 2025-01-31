const logHandling = (req, res, next) => {
  let send = res.send;
  res.send = (body) => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        status: res.statusCode,
        body:
          typeof body === "string" ? body : JSON.parse(JSON.stringify(body)),
      }),
    );

    res.send = send;
    return res.send(body);
  };
  next();
};

export default logHandling;
