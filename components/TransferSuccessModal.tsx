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
import { CheckSvg, TimesSvg } from "../assets/icons/svgs";

interface Props {
  mode: "dark" | "light";
  visible: boolean;
  onClose: () => void;
  selectedPhoneOrEmail: string;
  amount: string;
  receiversName: string;
  reversalDuration: string | number | undefined;
}

const LinkModalInfo: React.FC<Props> = ({
  mode,
  visible,
  onClose,
  selectedPhoneOrEmail,
  amount,
  receiversName,
  reversalDuration,
}: Props) => {
  const { current: startValue } = useRef(new Animated.Value(0));

  const isDarkMode = mode === "dark";
  const backgroundColor = isDarkMode ? colors.secondary : colors.transparent;
  const contentBackgroundColor = isDarkMode ? colors.secondary : colors.white;
  const textColor = isDarkMode ? colors.white : colors.textColor;

  const checkIconSize = Dimensions.get("window").height / 8;
  const closeIconSize = Dimensions.get("window").height / 40;

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


  return (
    <Modal
      animationType="slide"
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
              <CheckSvg width={checkIconSize} height={checkIconSize} />
            </Animated.View>
          </View>

          <Text style={{ ...styles.bodyText, color: textColor }}>
            <Text
              style={{
                ...styles["bold-uppercase"],
                fontSize: Dimensions.get("window").width / 18,
              }}
            >
              Transfer Successful
            </Text>
          </Text>

          <View>
            <Text style={{ ...styles.bodyText, color: textColor }}>
              <Text style={styles.bodyText}>
                You have successfully sent{" "}
                <Text
                  style={{ ...styles.innerText, ...styles["bold-uppercase"] }}
                >
                  ₦{+(amount).toLocaleString()}
                </Text>{" "}
                to{" "}
                <Text
                  style={{ ...styles.innerText, ...styles["bold-uppercase"], textTransform: "capitalize" }}
                >
                  {receiversName || selectedPhoneOrEmail}.
                </Text>{" "}
                Kindly ensure that they link their phone number or email in
                their bank's app. This payment will expire in {reversalDuration} day(s) and will
                return to your account.
              </Text>
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={onClose}
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
                width={closeIconSize}
                height={closeIconSize}
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
    fontSize: Dimensions.get("window").width / 20,
    lineHeight: Dimensions.get("window").height / 25,
    marginBottom: Dimensions.get("window").height / 20,
    textAlign: "center",
  },
  innerText: {
    paddingTop: Dimensions.get("window").height / 2,
    textAlign: "center",
  },
  "bold-uppercase": {
    fontFamily: "lato-bold",
    fontSize: Dimensions.get("window").width / 19,
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
