import { StyleSheet } from "react-native";

const styles = StyleSheet.create({


    container: {
      flex: 1,
      backgroundColor: "#000000", 
      padding: 10,
    },
    profileContainer: {
      padding: 20,
      marginTop: 30,
    },
    profileRow: {
      flexDirection: "row",
      alignItems: "center", 
    },
    personIconContainer: {
      marginRight: 20, 
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: "#A99EDE",
    },
    editIconContainer: {
      position: "absolute",
      bottom: 5,
      right: 5,
      backgroundColor: "#28443B",
      borderRadius: 15,
      padding: 5,
    },
    profileInfoContainer: {
      flex: 1, 
    },
    nameText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
    },
    cpfText: {
      color: "#FFFFFF",
      marginTop: 5,
    },
    setorText: {
      color: "#FFFFFF",
      marginTop: 5,
    },

  

  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  logoContainer: {
    marginTop: 150,
    alignItems: "center",
  },
  logoText: {
    color: "#00FF00", 
    fontSize: 24,
    fontWeight: "bold",
  },

  testButton: {
    backgroundColor: "#28443B",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
    dialog:{
      backgroundColor: "#fff",
    },
    dialogTitle: {
      color: "#000", 
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
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: 15,
    borderRadius: 5,
    margin: 15,
  },
  errorText: {
    color: "#721c24",
    fontSize: 16,
    textAlign: "center",
  },
 
successContainer: {
  marginTop: 10,
  padding: 10,
  backgroundColor: '#d4edda', 
  borderRadius: 5,
},
successText: {
  color: '#155724', 
  textAlign: 'center',
},
logoutButton: {
  backgroundColor: "#28443B",
  marginTop: 60,
  borderRadius: 10,
  width: 150,
  alignSelf: "flex-end",
  marginRight: 30,
},
  
});

export default styles;
