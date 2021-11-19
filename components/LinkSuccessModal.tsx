import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import colors from "../constants/colors";
import { CheckSvg, TimesSvg, LinkSvg } from "../assets/icons/svgs";

interface Props {
  mode: "dark" | "light";
  visible: boolean;
  handleModal: () => void;
  selectedPhoneOrEmail: string;
  accountNumber: string;
}

const LinkModalInfo: React.FC<Props> = ({
  mode,
  visible,
  handleModal,
  selectedPhoneOrEmail,
  accountNumber,
}: Props) => {
  const { current: startValue } = useRef(new Animated.Value(0));

  const isDarkMode = mode === "dark";
  const backgroundColor = isDarkMode ? colors.secondary : colors.transparent;
  const contentBackgroundColor = isDarkMode ? colors.secondary : colors.white;
  const textColor = isDarkMode ? colors.white : colors.textColor;

  const topIconSize = Dimensions.get("window").height / 10;
  const bottomIconSize = Dimensions.get("window").height / 40;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.spring(startValue, {
          toValue: -20,
          friction: 1,
          useNativeDriver: true,
        }),
        {
          iterations: 100,
        }
      ).start();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      handleModal();
    };
  }, []);

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
              marginBottom: Dimensions.get("window").height / 20,
            }}
          >
            <Animated.View
              style={[
                {
                  transform: [
                    {
                      translateY: startValue,
                    },
                  ],
                },
              ]}
            >
              <CheckSvg width={topIconSize} height={topIconSize} />
            </Animated.View>
          </View>

          <Text style={{ ...styles.bodyText, color: textColor }}>
            <Text
              style={{
                ...styles["bold-uppercase"],
                fontSize: Dimensions.get("window").width / 18,
              }}
            >
              Link Successful
            </Text>
          </Text>

          <View>
            <Text style={{ ...styles.bodyText, color: textColor }}>
              <Text
                style={{ ...styles.innerText, ...styles["bold-uppercase"] }}
              >
                {selectedPhoneOrEmail}
              </Text>{" "}
              <Text style={styles.bodyText}>
                has been linked to your bank account
              </Text>
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginBottom: Dimensions.get("window").height / 22,
            }}
          >
            <LinkSvg white />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text style={{ ...styles.bodyText, color: colors.white }}>
              {accountNumber}
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={handleModal}
              style={{
                backgroundColor: colors.white,
                width: 50,
                height: 50,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TimesSvg
                width={bottomIconSize}
                height={bottomIconSize}
                fill={mode === "dark" ? colors.secondary : colors.primary}
              />
            </TouchableOpacity>
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
    fontSize: Dimensions.get("window").width / 22,
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
    alignItems: "center",
    width: "100%",
    marginTop: Dimensions.get("window").height / 20,
  },
});

export default LinkModalInfo;
