import React from "react";
import { Image, View } from "react-native";

export default function Logo() {
  return (
    <View style={{}}>
      <Image
        source={require("../../assets/Logo2.png")}
        style={{ width: 250, height: 80 }}
      />
    </View>
  );
}
