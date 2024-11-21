import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
  Firestore,
  Timestamp,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { ListIasResponse, UserDetails } from "../@types";
import { cnpjValidator  } from "../lib";
import { useAuth } from "../Context/AuthContext";
import { User } from "firebase/auth";

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
        ? Timestamp.fromDate(iaData.dataCriacao) // Converte a data fornecida para um Timestamp
        : Timestamp.now(), // Caso não tenha dataCriacao, usa o timestamp atual
    });
    
    console.log(`IA criada com sucesso! ID: ${docRef.id}`);
    
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar IA:", error);
    throw error; // Lança o erro para que o chamador possa tratá-lo
  }
};


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

// Função para adicionar uma recomendação dentro de uma análise de desperdício
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

// Função para atualizar o status de uma IA
export async function updateIaStatus(iaId: string, statusVenda: string) {
  try {
    const iaRef = doc(database, "ias", iaId);
    await updateDoc(iaRef, {
      statusVenda: statusVenda
    });
  } catch (error) {
    console.error("Erro ao atualizar status da IA:", error);
    throw new Error("Erro ao atualizar status da IA: " + error.message);
  }
}
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
      const recomendacao = recomendacaoSnapshot.docs.map((doc) => doc.data());

      const analiseDesperdicioSnapshot = await getDocs(
        collection(
          doc(database, `usuarios/${userId}/ias`, idIa),
          "analiseDesperdicio"
        )
      );
      const analiseDesperdicio = analiseDesperdicioSnapshot.docs.map((doc) =>
        doc.data()
      );

      iasList.push({
        uid: idIa,
        nomeIa: iaData.nomeIa || "Sem nome",
        descricao: iaData.descricao || "Sem descrição",
        consumoAtual: iaData.consumoAtual || "0",
        dataCriacao: iaData.dataCriacao
          ? new Date(
              iaData.dataCriacao.seconds * 1000 +
                iaData.dataCriacao.nanoseconds / 1000000
            ).toLocaleString()
          : "Data não disponível",
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

export async function fetchRecomendacoes(iaId: string) {
  const recomendacoesRef = collection(doc(database, "ias", iaId), "recomendacao");
  const recomendacoesSnapshot = await getDocs(recomendacoesRef);
  const recomendacoes = recomendacoesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return recomendacoes;
}


