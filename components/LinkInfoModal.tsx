import React from "react";
import { View, StyleSheet, Text, Dimensions, Modal } from "react-native";
import colors from "../constants/colors";
import CustomButton from "./CustomButton";
import { WaveSvg } from "../assets/icons/svgs";

interface Props {
  mode: "dark" | "light";
  visible: boolean;
  handleModal: () => void;
}

const LinkModalInfo: React.FC<Props> = ({ mode, visible, handleModal }: Props) => {
  const backgroundColor =
    mode === "dark" ? colors.secondary : colors.transparent;
  const contentBackgroundColor =
    mode === "dark" ? colors.secondary : colors.white;
  const textColor = mode === "dark" ? colors.white : colors.textColor;

  const iconSize = Dimensions.get("window").height / 10;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      style={{ flex: 1 }}
    >
      <View style={{ ...styles.modal, backgroundColor }}>
        <View
          style={{ ...styles.content, backgroundColor: contentBackgroundColor }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: Dimensions.get('window').height / 20,
            }}
          >
            <WaveSvg
              width={iconSize}
              height={iconSize}
              fill={mode === "dark" ? colors.secondary : colors.primary}
            />
          </View>

          <Text style={{ ...styles.bodyText, color: textColor }}>
            <Text style={{ ...styles["bold-uppercase"] }}>Hi again!</Text>
          </Text>

          <View>
            <Text style={{ ...styles.bodyText, color: textColor }}>
              <Text style={styles.innerText}>
                You’d be linking your account number to an alias (phone
                number/email) in the following screens.
              </Text>
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <CustomButton
              text="Proceed"
              focus
              mode={mode}
              onPress={handleModal}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginHorizontal: 20,
    height: Dimensions.get("window").height / 1.25,
    paddingHorizontal: Dimensions.get("window").width / 20,
    paddingVertical: Dimensions.get("window").height / 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Dimensions.get("window").height / 20,
  },
  bodyText: {
    fontFamily: "lato-regular",
    fontSize: Dimensions.get("window").width / 26,
    lineHeight: Dimensions.get("window").height / 30,
    marginBottom: Dimensions.get("window").height / 20,
    textAlign: "center",
  },
  innerText: {
    paddingTop: Dimensions.get("window").height / 2,
    textAlign: "center",
  },
  "bold-uppercase": {
    fontFamily: "lato-bold",
    fontSize: Dimensions.get("window").width / 22,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Dimensions.get("window").height / 20,
  },
});

export default LinkModalInfo;
