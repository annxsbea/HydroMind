import { ApiService } from './apiService';
import { AnaliseDesperdicio, Recomendacao, ListIasResponse } from '../@types/apis/ListIas'; // Ajuste o caminho conforme necessário.

export class DataService {
    private apiService: ApiService;
    private baseEndpoint: string;

    constructor() {
        this.apiService = new ApiService();
        this.baseEndpoint = 'data'; 
    }

    async getAllIas(): Promise<ListIasResponse[]> {
        return this.apiService.get<ListIasResponse[]>(`${this.baseEndpoint}/ias`);
    }

    async getIaById(uid: string): Promise<ListIasResponse> {
        return this.apiService.get<ListIasResponse>(`${this.baseEndpoint}/ias/${uid}`);
    }

    async createIa(data: Omit<ListIasResponse, 'uid'>): Promise<ListIasResponse> {
        return this.apiService.post<ListIasResponse, Omit<ListIasResponse, 'uid'>>(`${this.baseEndpoint}/ias`, data);
    }

    async updateIa(uid: string, data: Partial<ListIasResponse>): Promise<ListIasResponse> {
        return this.apiService.put<ListIasResponse, Partial<ListIasResponse>>(`${this.baseEndpoint}/ias/${uid}`, data);
    }

    async deleteIa(uid: string): Promise<void> {
        await this.apiService.delete<void>(`${this.baseEndpoint}/ias/${uid}`);
    }

    async getAnalises(): Promise<AnaliseDesperdicio[]> {
        return this.apiService.get<AnaliseDesperdicio[]>(`${this.baseEndpoint}/analises`);
    }

    async getAnaliseById(id: string): Promise<AnaliseDesperdicio> {
        return this.apiService.get<AnaliseDesperdicio>(`${this.baseEndpoint}/analises/${id}`);
    }

    async createAnalise(data: Omit<AnaliseDesperdicio, 'id'>): Promise<AnaliseDesperdicio> {
        return this.apiService.post<AnaliseDesperdicio, Omit<AnaliseDesperdicio, 'id'>>(`${this.baseEndpoint}/analises`, data);
    }

    async updateAnalise(id: string, data: Partial<AnaliseDesperdicio>): Promise<AnaliseDesperdicio> {
        return this.apiService.put<AnaliseDesperdicio, Partial<AnaliseDesperdicio>>(`${this.baseEndpoint}/analises/${id}`, data);
    }

    async deleteAnalise(id: string): Promise<void> {
        await this.apiService.delete<void>(`${this.baseEndpoint}/analises/${id}`);
    }

    async getRecomendacoes(): Promise<Recomendacao[]> {
        return this.apiService.get<Recomendacao[]>(`${this.baseEndpoint}/recomendacoes`);
    }

    async getRecomendacaoById(id: string): Promise<Recomendacao> {
        return this.apiService.get<Recomendacao>(`${this.baseEndpoint}/recomendacoes/${id}`);
    }

    async createRecomendacao(data: Omit<Recomendacao, 'id'>): Promise<Recomendacao> {
        return this.apiService.post<Recomendacao, Omit<Recomendacao, 'id'>>(`${this.baseEndpoint}/recomendacoes`, data);
    }

    async updateRecomendacao(id: string, data: Partial<Recomendacao>): Promise<Recomendacao> {
        return this.apiService.put<Recomendacao, Partial<Recomendacao>>(`${this.baseEndpoint}/recomendacoes/${id}`, data);
    }

    async deleteRecomendacao(id: string): Promise<void> {
        await this.apiService.delete<void>(`${this.baseEndpoint}/recomendacoes/${id}`);
    }
}
