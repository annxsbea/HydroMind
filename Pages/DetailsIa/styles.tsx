// src/screens/DetailsClient.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'black',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    marginTop: 60,
  },
  backButton: {
    marginLeft: 20,
  },
  logoContainer: {
    backgroundColor: '#0000',
    marginLeft: 50,
  },

  
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },  

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuButton: {
    padding: 10, // Espaçamento interno para tornar o botão mais clicável
    backgroundColor: '#3C6558', // Cor de fundo azul
    borderRadius: 50, // Tornando o botão arredondado
    alignItems: 'center', // Alinhamento do conteúdo (ícone)
    justifyContent: 'center', // Centralizando o conteúdo (ícone)
    width: 50, // Largura do botão
    height: 50, // Altura do botão (tamanho fixo)
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.5, 
    elevation: 5, 
  },
  
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 15,
    padding: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },

  clientInfoContainer: {
    padding: 20,
  },
  clientName: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 25,
    marginRight: 20,
  },
  clientProfile: {
    color: '#9987A3',
    textAlign: 'left',
    marginTop: 30,
    fontSize: 15,
    marginRight: 20,
  },
  profileBadge: {
    backgroundColor: '#ACABBA',
    borderRadius: 10,
    marginTop: 10,
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#0F3A3A',
    fontWeight: 'bold',
    fontSize: 15,
  },
  clientDetailCard: {
    padding: 20,
    backgroundColor: '#3C5A65',
    borderRadius: 10,
    marginTop: 20,
  },
  clientDetailText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#97A5A0 ',
  },
  clientDetailValue: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  especificacoesCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#181724',
    borderRadius: 10,
  },
  especificacoesTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scriptTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  scriptDescription: {
    color: '#fff',
    fontSize: 18,
  },

  containerButton: {
    alignItems: "center",
    padding: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 30, 
    backgroundColor: "#3D3270",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10, 
  },
  vendaButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },


  updateButton: {
    marginTop: 20,
  },
  scriptContainer: {
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#333",
  },

  scriptCard: {
    backgroundColor: "#66044B", 
    padding: 10, 
    marginBottom: 10, 
    width: "60%", 
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, 
  },

});
