import React from "react";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Linking,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

export default function Carrossel() {
  const [pagingEnabled, setPagingEnabled] = useState(true);
  const width = Dimensions.get("window").width;
  const DATA = [
    {
      image: require("../../assets/slide1.png"),
      link: "https://agua.org.br/blog/a-relacao-entre-consumo-de-agua-e-energia-com-a-inteligencia-artificial/",
    },
    {
      image: require("../../assets/slide2.png"),
      link: "https://oglobo.globo.com/economia/tecnologia/noticia/2023/05/treino-do-chatgpt-consumiu-700-mil-litros-de-agua-equivalente-a-encher-uma-torre-de-resfriamento-de-um-reator-nuclear.ghtml",
    },
 
  ];

  const handlePress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        width={width}
        height={width / 2}
        data={DATA}
        autoPlay={true}
        pagingEnabled={pagingEnabled}
        scrollAnimationDuration={3000}
        renderItem={({ item }) => (
          <Pressable
            style={styles.CarouselItem}
            onPress={() => handlePress(item.link)}
          >
            <Image style={styles.img} source={item.image} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  CarouselItem: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: 10,
    alignItems: "center",
  },
  img: {
    width: "80%",
    height: "80%",
  },
});
