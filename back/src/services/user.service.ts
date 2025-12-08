import User, { IUser } from '../models/user';
import { RegisterDTO } from '../types/dtos/user.dto';

export const createUser = async (payload: RegisterDTO): Promise<IUser> => {
const user = new User(payload as any);
return user.save();
};


export const findUserByEmail = async (email: string) => {
return User.findOne({ email }).exec();
};