import React from "react";
import { Image, View } from "react-native";

export default function Fundo() {
  return (
    <View style={{ alignContent: "center", alignItems: "center" }}>
      <Image
        source={require("../../assets/fundo.png")}
        style={{ width: 500, height: 350, opacity: 1 }}
      />
    </View>
  );
}
