import { DocumentData, Timestamp } from "firebase/firestore"; 
export interface AnaliseDesperdicio {
  id: string; 
  descricao: string;
  dataAnalise: Timestamp | string;
  desperdicioCalculado: number; 
}
export interface Recomendacao {
  id: string; 
  descricao: string; 
  dataRecomendacao: Timestamp | string; 
  implementada: boolean;
}

  export interface ListIasResponse {
    uid: string; 
    nomeIa: string; 
    descricao: string;
    consumoAtual: string;
    dataCriacao: Timestamp | string; 
    status: string; 
    analiseDesperdicio?: DocumentData[]; 
    recomendacao?: DocumentData[];
  }
