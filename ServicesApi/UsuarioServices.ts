import { ApiService } from './apiService';
import { UserDetails } from '../@types/apis/UserDetails';

export class UserService {
    private apiService: ApiService;
    private baseEndpoint: string;

    constructor() {
        this.apiService = new ApiService();
        this.baseEndpoint = 'users'; 
    }

    async getAllUsers(): Promise<UserDetails[]> {
        return this.apiService.get<UserDetails[]>(this.baseEndpoint);
    }

    async getUserById(uid: string): Promise<UserDetails> {
        return this.apiService.get<UserDetails>(`${this.baseEndpoint}/${uid}`);
    }

    async createUser(user: Omit<UserDetails, 'uid'>): Promise<UserDetails> {
        return this.apiService.post<UserDetails, Omit<UserDetails, 'uid'>>(this.baseEndpoint, user);
    }

    async updateUser(uid: string, user: Partial<UserDetails>): Promise<UserDetails> {
        return this.apiService.put<UserDetails, Partial<UserDetails>>(`${this.baseEndpoint}/${uid}`, user);
    }

    async deleteUser(uid: string): Promise<void> {
        await this.apiService.delete<void>(`${this.baseEndpoint}/${uid}`);
    }
}
