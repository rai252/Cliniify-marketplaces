import { APIService } from "../services/api.service";
import { IUser, IChangePassword } from "../types/user/user";

class UserService extends APIService {
    async getcurrentUser(params: any = {}): Promise<IUser> {
        return this.get('/api/users/me/', { params })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async changePassword(id: number, data: IChangePassword): Promise<any> {
        return this.post(`/api/users/${id}/change_password/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}

export const userService = new UserService();
