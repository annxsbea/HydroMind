import { StackNavigationProp } from "@react-navigation/stack";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { UserDetails, ListIasResponse } from "./apis";

export type MainStackParamList = {
  Home: { };
  Search: undefined;
  Profile: undefined;
  DetailsIa: { ia: ListIasResponse };
  TestePerson: undefined;     
  ResultadoPerfil:{ perfil: string }; 
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: NavigatorScreenParams<MainStackParamList>;
};
interface NavigatorProps {
  id?: string; 
  children: React.ReactNode;
}

export type HomeScreenProp = StackNavigationProp<MainStackParamList, 'Home'>;
export type DetailsIaNavigationProp = StackNavigationProp<MainStackParamList, 'DetailsIa'>;
export type TestePersonScreenProp = StackNavigationProp<MainStackParamList, 'TestePerson'>;
export type SignInScreenProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
export type SignUpScreenProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
export type ProfileScreenProp = StackNavigationProp<MainStackParamList, 'Profile'>;
export type ResultadoPerfilScreen = StackNavigationProp<MainStackParamList, 'ResultadoPerfil'>;

export type HomeScreenRouteProp = RouteProp<MainStackParamList, 'Home'>;
export type DetailsIaRouteProp = RouteProp<MainStackParamList, 'DetailsIa'>;
export type TestePersonRouteProp = RouteProp<MainStackParamList, 'TestePerson'>;
export type ProfileScreenRouteProp = RouteProp<MainStackParamList, 'Profile'>;
export type ResultadoPerfilRouteProp = RouteProp<MainStackParamList, 'ResultadoPerfil'>;
