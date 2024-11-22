import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  titleContainer: {
    marginBottom: 20, // Espaço entre o título e a lista
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  dialog:{
    backgroundColor: "#000",
  },
  dialogTitle: {
    color: "#fff", 
  },
    logoutButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#D0CCE4",
    textAlign: "center",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff", 
    backgroundColor: "#1B2736",
    color: "#FFFFFF",
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: "#172823", 
    marginTop: 20,
  },

  attachmentButton: {
    backgroundColor: "#001F3F", 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00FF00", 
  },
  attachmentButtonText: {
    color: "#00FF00", 
    fontSize: 16,
  }, 
  logoContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  searchContainer: {
    marginTop: 20,
  },
  searchbar: {
    backgroundColor: "#554059",
    opacity: 0.8,
    borderRadius: 15,
    padding: 2,
    margin: 20,
    marginTop: 80,
  },
  searchbarInput: {
    color: "#fff",
  },
  clientListContainer: {
    flex: 1,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    padding: 20,
  },
  title: {
    color: "white",
    marginTop: 50,
    fontSize: 25,
    alignSelf: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    flexGrow: 1,
  },
  clientCard: {
    backgroundColor: "#3C5A65",
    opacity: 0.7,
    marginTop: 20,
    marginLeft: 10,
    borderRadius: 10,
    padding: 20,
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
  },
  clientName: {
    color: "white",
    fontSize: 22,
    marginTop: -35,
  },
  clientDetails: {
    color: "white",
    fontSize: 14, 
    marginTop: 55,
  },
  
  snackbar: {
    backgroundColor: "#333",
  },
});

export default styles;
