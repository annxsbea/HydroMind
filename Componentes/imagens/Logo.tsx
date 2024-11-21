import React from "react";
import { Image, View } from "react-native";

export default function Logo() {
  return (
    <View style={{}}>
      <Image
        source={require("../../assets/Logo.png")}
        style={{ width: 150, height: 200 }}
      />
    </View>
  );
}
