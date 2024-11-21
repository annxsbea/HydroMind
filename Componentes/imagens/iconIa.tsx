import React from "react";
import { Image, View } from "react-native";

export default function IconIa() {
  return (
    <View style={{ alignContent: "center", alignItems: "center" }}>
      <Image source={require("../../assets/ICONIA.png")} style={{ width: 100, height: 100}} />
    </View>
  );
}
