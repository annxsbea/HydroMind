import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  updateDoc,
  getDoc,
  Firestore,
  Timestamp,
  deleteDoc,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../firebaseConfig";


export const criarIa = async (
  userId: string,
  iaData: {
    nomeIa: string;
    descricao: string;
    consumoAtual: number;
    status: string;
    dataCriacao?: Date;
    fileUrl: string; 
  }
): Promise<string> => {
  try {
    const iaCollectionRef = collection(database, `usuario/${userId}/ias`);
    
    const docRef = await addDoc(iaCollectionRef, {
      ...iaData,
      dataCriacao: iaData.dataCriacao
        ? Timestamp.fromDate(iaData.dataCriacao) 
        : Timestamp.now(), 
    });
    
    console.log(`IA criada com sucesso! ID: ${docRef.id}`);
    
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar IA:", error);
    throw error;
  }
};
export async function excluirIa(userId: string, iaId: string): Promise<void> {
  try {
    const iaCollectionRef = collection(database, `usuario/${userId}/ias`);

    const querySnapshot = await getDocs(iaCollectionRef);
    let iaExistente = false;

    querySnapshot.forEach(doc => {
      if (doc.id === iaId) {
        iaExistente = true;
      }
    });

    if (!iaExistente) {
      throw new Error("A IA não pertence ao usuário logado.");
    }

    const iaRef = doc(database, `usuario/${userId}/ias`, iaId);
    await deleteDoc(iaRef);
    
    console.log("IA excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir IA:", error);
    throw new Error("Erro ao excluir IA: " + error.message);
  }
}
export async function editarIa(
  userId: string, 
  iaId: string,
  updatedData: {
    nomeIa?: string;
    descricao?: string;
    consumoAtual?: string;
    status?: string;
  }
): Promise<void> {
  try {
    const iaRef = doc(database, `usuario/${userId}/ias`, iaId);

    console.log("Referência do documento:", iaRef);

    const docSnapshot = await getDoc(iaRef);
    if (!docSnapshot.exists()) {
      console.error("Documento não encontrado:", iaId);
      throw new Error("IA não encontrada. Não foi possível editar.");
    }

    await updateDoc(iaRef, updatedData);
    console.log("IA editada com sucesso!");
  } catch (error) {
    console.error("Erro ao editar a IA:", error);
    throw new Error("Erro ao editar a IA: " + error.message);
  }
}


export async function adicionaranalise_Desperdicio(
  idIa: string,
  analise: any
) {
  try {
    await addDoc(
      collection(database, "ias", idIa, "analise_Desperdicio"),
      analise
    );
  } catch (error) {
    console.error("Erro ao adicionar análise de desperdício:", error);
    throw error;
  }
}

export async function adicionarRecomendacao(
  idIa: string,
  idAnalise: string,
  recomendacao: any
) {
  try {
    await addDoc(
      collection(database, "ias", idIa, "analise_Desperdicio", idAnalise, "recomendacao"),
      recomendacao
    );
  } catch (error) {
    console.error("Erro ao adicionar recomendação:", error);
    throw error;
  }
}
export async function updateIaStatus(iaId: string, statusVenda: string) {
  try {
    const iaRef = doc(database, "ias", iaId);
    
    // Verifica se o documento existe
    const iaDoc = await getDoc(iaRef);
    if (!iaDoc.exists()) {
      throw new Error("Documento não encontrado!");
    }

    // Atualiza o status se o documento existir
    await updateDoc(iaRef, {
      statusVenda: statusVenda
    });
    console.log("Status atualizado com sucesso!");
    
  } catch (error) {
    console.error("Erro ao atualizar status da IA:", error);
    throw new Error("Erro ao atualizar status da IA: " + error.message);
  }
} 


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
  analiseDesperdicio?: AnaliseDesperdicio[]; 
  recomendacao?: Recomendacao[];
}
export const criarAnaliseDesperdicio = async (
  userId: string,
  iaId: string,
  descricao: string,
  desperdicioCalculado: number
) => {
  try {
    const analisesRef = collection(database, `usuario/${userId}/ias/${iaId}/analiseDesperdicio`);

    const novaAnalise = {
      descricao,
      dataAnalise: Timestamp.now(),
      desperdicioCalculado,
    };

    const docRef = await addDoc(analisesRef, novaAnalise);
    return docRef.id; // Retorna o ID do documento criado
  } catch (error) {
    console.error("Erro ao criar análise de desperdício:", error);
    throw error;
  }
};
export const ouvirAnalisesDesperdicio = (
  userId: string,
  iaId: string,
  callback: (analises: any[]) => void
) => {
  try {
    const analisesRef = collection(database, `usuario/${userId}/ias/${iaId}/analiseDesperdicio`);

    return onSnapshot(analisesRef, (snapshot) => {
      const analises = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(analises); // Envia os dados para a função de callback
    });
  } catch (error) {
    console.error("Erro ao ouvir análises de desperdício:", error);
    throw error;
  }
};
export const buscarAnalisesDesperdicio = async (userId: string, iaId: string) => {
  try {
    const analisesRef = collection(database, `usuario/${userId}/ias/${iaId}/analiseDesperdicio`);
    const snapshot = await getDocs(analisesRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar análises de desperdício:", error);
    throw error;
  }
};


export const obterIas = async (userId: string): Promise<ListIasResponse[]> => {
  try {
    const iaCollectionRef = collection(database, `usuario/${userId}/ias`);
    const querySnapshot = await getDocs(iaCollectionRef);
    const iasList: ListIasResponse[] = [];

    for (const iaDoc of querySnapshot.docs) {
      const iaData = iaDoc.data();
      const idIa = iaDoc.id;

      const recomendacaoSnapshot = await getDocs(
        collection(doc(database, `usuario/${userId}/ias`, idIa), "recomendacao")
      );
      const recomendacao = recomendacaoSnapshot.docs.map((doc) => doc.data() as Recomendacao);
      const analiseDesperdicioSnapshot = await getDocs(
        collection(doc(database, `usuario/${userId}/ias`, idIa), "analiseDesperdicio")
      );
      const analiseDesperdicio = analiseDesperdicioSnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id, 
          descricao: data.descricao || "Sem descrição",
          dataAnalise: data.dataAnalise ? new Date(data.dataAnalise.seconds * 1000 + data.dataAnalise.nanoseconds / 1000000).toLocaleString() : "Data não disponível",
          desperdicioCalculado: data.desperdicioCalculado || 0,
        } as AnaliseDesperdicio;
      });

      iasList.push({
        uid: idIa,
        nomeIa: iaData.nomeIa || "Sem nome",
        descricao: iaData.descricao || "Sem descrição",
        consumoAtual: iaData.consumoAtual || "0",
        dataCriacao: iaData.dataCriacao ? new Date(iaData.dataCriacao.seconds * 1000 + iaData.dataCriacao.nanoseconds / 1000000).toLocaleString() : "Data não disponível",
        status: iaData.status || "Desconhecido",
        analiseDesperdicio: analiseDesperdicio,
        recomendacao: recomendacao,
      });
    }

    return iasList;
  } catch (error) {
    console.error("Erro ao obter as IAs com detalhes:", error);
    throw error;
  }
};

export const ouvirRecomendacoes = (
  userId: string,
  iaId: string,
  callback: (recomendacoes: any[]) => void
) => {
  try {
    const recomendacoesRef = collection(database, `usuario/${userId}/ias/${iaId}/recomendacao`);

    return onSnapshot(recomendacoesRef, (snapshot) => {
      const recomendacoes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(recomendacoes);
    });
  } catch (error) {
    console.error("Erro ao ouvir recomendações:", error);
    throw error;
  }
};
export const criarRecomendacao = async (userId: string, iaId: string, descricao: string) => {
  try {
    const recomendacoesRef = collection(database, `usuario/${userId}/ias/${iaId}/recomendacoes`);

    const novaRecomendacao = {
      descricao,
      dataRecomendacao: Timestamp.now(),
      implementada: false,
    };

    const docRef = await addDoc(recomendacoesRef, novaRecomendacao);
    return docRef.id; 
  } catch (error) {
    console.error("Erro ao criar recomendação:", error);
    throw error;
  }
};

export async function fetchRecomendacoes(iaId: string) {
  const recomendacoesRef = collection(doc(database, "ias", iaId), "recomendacao");
  const recomendacoesSnapshot = await getDocs(recomendacoesRef);
  const recomendacoes = recomendacoesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return recomendacoes;
}


