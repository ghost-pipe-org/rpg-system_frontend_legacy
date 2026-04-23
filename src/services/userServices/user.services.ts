import api from '../api';
import type { User } from './user.types';

export const createUser = async (user: User) => {
    const response = await api.post('/users', user);
    return response.data;
};

export const updateUserProfile = async (data: { name?: string, phoneNumber?: string }) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
};

export const updateUserPassword = async (data: any) => {
    const response = await api.patch('/users/password', data);
    return response.data;
};

export const updateUserEmail = async (data: any) => {
    const response = await api.patch('/users/email', data);
    return response.data;
};