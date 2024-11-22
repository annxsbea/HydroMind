// import { useState } from "react";
// import { View } from "react-native";
// import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";

// export const CriarIa = () => {
//     const [iaName, setIaName] = useState("");
//     const [iaDescription, setIaDescription] = useState("");
//     const [iaConsumption, setIaConsumption] = useState("");
//     const [fileUri, setFileUri] = useState<string>("");


//     const escolherArquivo = async () => {
//         const { status } = await <ImagePicker></ImagePicker>.requestMediaLibraryPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permissão necessária",
//             "Precisamos de permissão para acessar sua galeria."
//           );
//           return;
//         }
//         const result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           quality: 1,
//         });
    
//         if (!result.canceled) {
//           const fileUrl = result.assets[0].uri;
//           setFileUri(fileUrl);
//           console.log("Arquivo selecionado:", fileUrl);
//         }
//       };
//     return 
//     <View>
//   <Portal>
//         <Dialog
//           visible={visibleIaDialog}
//           onDismiss={() => setVisibleIaDialog(false)}
//           style={styles.dialog}
//         >
//           <Dialog.Title style={styles.dialogTitle}>Nova IA</Dialog.Title>
//           <Dialog.Content>
//             <TextInput 
//               style={styles.input}
//               placeholder="Nome da IA"
//               placeholderTextColor="#9E9E9E"
//               value={iaName}
//               onChangeText={setIaName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Descrição"
//               placeholderTextColor="#9E9E9E"
//               value={iaDescription}
//               onChangeText={setIaDescription}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Consumo Atual (em kWh)"
//               placeholderTextColor="#9E9E9E"
//               value={iaConsumption}
//               onChangeText={setIaConsumption}
//               keyboardType="numeric"
//             />
//            <View style={{ marginBottom: 20 }}>
//               <Text style={{ color: "#fff", marginBottom: 10 }}>
//                 Anexar arquivo com dados de consumo:
//               </Text>
//               <Button
//                 mode="contained"
//                 onPress={escolherArquivo}
//                 contentStyle={{
//                   flexDirection: "row",
//                   alignItems: "center", 
//                   width: 100
//                 }}
//                 style={{
//                   justifyContent: "center",
//                   alignItems: "center",
//                   backgroundColor: "#1B2736",
//                 }}
//               >
//                 <Text style={{ color: "#fff", fontSize: 16 }}>
//                   Escolher Arquivo
//                 </Text>
//               </Button>
//             </View>
//             <Button
//               mode="contained"
//               onPress={handleCreateIa}
//               style={styles.createButton}
//             >
//               Criar IA
//             </Button>
//           </Dialog.Content>
//           <Dialog.Actions>
//             <Button onPress={() => setVisibleIaDialog(false)} color="#fff">
//               Cancelar
//             </Button>
//           </Dialog.Actions>
//         </Dialog>
//       </Portal>
//     </View>
// };