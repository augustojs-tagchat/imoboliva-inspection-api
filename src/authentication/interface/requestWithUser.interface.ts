import { Request } from 'express';
import { Appraiser } from '../../appraiser/schemas/appraiser.schema';

interface RequestWithUser extends Request {
  user: Appraiser;
}

export default RequestWithUser;
