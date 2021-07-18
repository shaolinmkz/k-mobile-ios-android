import React from "react";
import { View, Image, Modal } from "react-native";

const SplashScreen = ({ logo }: React.ComponentProps<any>) => {
  return (
    <Modal animationType="none" transparent={false} visible style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{
            uri: logo,
            width: 100,
            height: 100,
          }}
        />
      </View>
    </Modal>
  );
};

export default SplashScreen;
