export type ILoginPayload = {
  cpf: string;
  senha: string;
}
export type SignUpFormInterface = {
  nome: string;
  cpf: string;

  senha: string;
  perfil: string;  

}

export type SignInResponse = {
  id: string;
  nome: string;
  cpf: string;

  perfil: string;  
  token: string;   
}

export type SignUpResponse = {
  message: string; 
  atendente?: {
    id: string;
    nome: string;
    cpf: string;
    perfil: string;
  };
}
