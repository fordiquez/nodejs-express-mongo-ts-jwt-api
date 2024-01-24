import { Document } from 'mongoose';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export default interface User extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRole;

    isValidPassword(password: string): Promise<Error | boolean>;
}
