import { withDB } from 'middleware';
import { login } from 'server';

const loginApi = async (req, res) => {
  const loginResponse = await login(req.body);

  res.status(loginResponse?.success ? 200 : 400).json(loginResponse);
};

export default withDB(loginApi);
