import React from "react";
import { View, StyleSheet, Modal, Dimensions, Platform } from "react-native";
import colors from "../constants/colors";
import { ternaryResolver } from "../helpers";

interface Props {
  mode: "plain" | "transparent";
  visible: boolean;
  children: React.ReactNode;
  parentStyle?: any;
}

const CustomModal: React.FC<Props> = ({ mode, visible, children, parentStyle }: Props) => {
  const backgroundColor = ternaryResolver(mode === "plain", colors.white, colors.transparent);

  return (
    <Modal animationType="fade" transparent visible={visible} style={{ flex: 1 }}>
      <View style={{ ...styles.modal, backgroundColor, ...parentStyle }}>
        {children}
      </View>
    </Modal>
  );
};

CustomModal.defaultProps = {
  parentStyle: {},
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingHorizontal: Dimensions.get("window").width / 15,
    marginTop: Dimensions.get("window").height / ternaryResolver(Platform.OS === "android", 12.5, 9.5),
  },
});

export default CustomModal;
