import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0].readyState;
  }

  await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log('connected to MongoDB');
  return mongoose.connections[0].readyState;
};
