import mongoose from 'mongoose';

export const withDB = (handler) => async (req, res) => {

  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log('connected', mongoose.connections[0].readyState);

  return handler(req, res);
};
