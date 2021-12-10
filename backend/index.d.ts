import { Room } from './src/model/Room';
import {User} from './src/model/User';

declare global {
    namespace Express {
        interface Request {
            user?: User
            room?: Room
            group_users?: User[]
        }
    }
}