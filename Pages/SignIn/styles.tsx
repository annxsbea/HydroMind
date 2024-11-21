import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
  backgroundImage: {
    position: 'absolute',
  },
  pressable: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "transparent",
  },
  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: -100,
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  cardTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#9c9c9c',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContent: {
    marginVertical: 10,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: 'black',
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  gradientButton1: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "70%",
    justifyContent: "center",
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    color: '#9c9c9c',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#d9534f',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },

 
});
