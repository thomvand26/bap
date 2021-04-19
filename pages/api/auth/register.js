import { withDB } from 'middleware';
import { register } from '../../../server/utils';

const registerApi = async (req, res) => {
  const registerResponse = await register(req.body);

  res.status(registerResponse?.success ? 200 : 400).json(registerResponse);
};

export default withDB(registerApi);
