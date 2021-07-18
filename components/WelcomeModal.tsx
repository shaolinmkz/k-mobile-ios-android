import React from "react";
import { View, StyleSheet, Text, Dimensions, Modal } from "react-native";
import colors from "../constants/colors";
import CustomButton from "./CustomButton";

interface Props {
  mode: "dark" | "light";
  data?: any;
  visible: boolean;
  onClose: () => void;
}

const Welcome: React.FC<Props> = ({
  mode,
  visible,
  onClose,
  data,
}: Props) => {
  const backgroundColor =
    mode === "dark" ? colors.secondary : colors.transparent;
  const contentBackgroundColor =
    mode === "dark" ? colors.secondary : colors.white;
  const textColor = mode === "dark" ? colors.white : colors.textColor;

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      style={{ flex: 1 }}
    >
      <View style={{ ...styles.modal, backgroundColor }}>
        <View
          style={{ ...styles.content, backgroundColor: contentBackgroundColor }}
        >
          <Text
            style={{
              ...styles.title,
              color: textColor,
              ...styles["bold-uppercase"],
              fontSize: Dimensions.get("window").width / 18,
            }}
          >
            WELCOME!
          </Text>

          <Text style={{ ...styles.bodyText, color: textColor }}>
            <Text style={{ ...styles["bold-uppercase"] }}>
              A FEW TERMS AND CONDITIONS BEFORE YOU PROCEED
            </Text>
          </Text>
          <View>
            <Text style={{ ...styles.bodyText, color: textColor }}>
              “<Text style={{ textTransform: "uppercase" }}>{`${data?.label} `}</Text>
              is not liable for transfers to a wrong beneficiary Phone number or
              Email address.
            </Text>
          </View>

          <View>
            <Text style={{ ...styles.bodyText, color: textColor }}>
              <Text style={styles.innerText}>
                We hereby hold harmless and free as well as indemnify{" "}
                <Text style={{ textTransform: "uppercase" }}>{`${data?.label} `}</Text>
                from any loss or liability which{" "}
                <Text style={{ textTransform: "uppercase" }}>{`${data?.label} `}</Text> may face or incur
                as a result of such wrongful transfers.”
              </Text>
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <CustomButton
              text="Accept"
              focus
              mode={mode}
              onPress={onClose}
            />
            <CustomButton
              text="Decline"
              focus={false}
              mode={mode}
              onPress={onClose}
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
    textTransform: "uppercase",
    fontSize: Dimensions.get("window").width / 22,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Dimensions.get("window").height / 20,
  },
});

export default Welcome;
