import { getSession } from 'next-auth/client';

import { withDB } from 'middleware';
import { User } from 'models';
import { sendGoodbyeEmail } from '@/server';

const user = async (req, res) => {
  const { method } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      case 'POST':
        if (!session?.user?._id) throw new Error('Not logged in!');

        if (req.body.delete) {
          responseData = await User.findByIdAndRemove(
            session.user._id,
          );
  
          // Send goodbye email
          await sendGoodbyeEmail(responseData, req.body.locale);
        }

        responseData = await User.findOneAndUpdate(
          { _id: session.user._id },
          req.body,
          {
            new: true,
          }
        );

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(user);
