import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'https://cautious-invention-j4v4qq7vjjqcwrg-8080.app.github.dev/';
    }

    private async request<R>(config: AxiosRequestConfig): Promise<R> {
        try {
            const token = await AsyncStorage.getItem('authToken'); 
            if (token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,  
                };
            }
            const response = await axios(config);
            return response.data;
        } catch (error: any) {
            console.error('API Request error:', error.response?.data || error.message);
            throw error.response?.data || error;
        }
    }

    async get<R>(endpoint: string): Promise<R> {
        const url = `${this.baseUrl}${endpoint}`;
        const config: AxiosRequestConfig = {
            method: 'GET',
            url,
        };
        return this.request<R>(config);
    }

    async post<R, B>(endpoint: string, body?: B): Promise<R> {
        const url = `${this.baseUrl}${endpoint}`;
        const config: AxiosRequestConfig = {
            method: 'POST',
            url,
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.request<R>(config);
    }

    async put<R, B>(endpoint: string, body?: B): Promise<R> {
        const url = `${this.baseUrl}${endpoint}`;
        const config: AxiosRequestConfig = {
            method: 'PUT',
            url,
            data: body,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return this.request<R>(config);
    }

    async delete<R>(endpoint: string): Promise<R> {
        const url = `${this.baseUrl}${endpoint}`;
        const config: AxiosRequestConfig = {
            method: 'DELETE',
            url,
        };
        return this.request<R>(config);
    }
}