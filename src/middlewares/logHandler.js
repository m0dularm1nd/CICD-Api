const logHandling = (req, res, next) => {
  let send = res.send;
  res.send = (c) => {
    console.log(`Code: ${res.statusCode}`);
    console.log(c);
    res.send = send;
    return res.send(c);
  };
  next();
};

export default logHandling;
