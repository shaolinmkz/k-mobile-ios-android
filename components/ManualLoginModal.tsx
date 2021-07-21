import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Input, Icon, Box } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import {
  ternaryResolver,
} from "../helpers";
import useAppState from "../hooks/useAppState";
import {
  loginAction,
} from "../redux/actions";

interface IManualLoginModal {
  onClose: (data?: any) => void;
}

const ManualLoginModal = ({ onClose }: IManualLoginModal) => {

  const modalRef1 = useRef(null);
  const modalRef2 = useRef(null);
  const { dispatch, selectedBank } = useAppState();


  const [localActionLoading, setLocalActionLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localState, setLocalState] = useState({
    username: "",
    password: "",
  });

  type Tfields = "username" | "password";

  const handleInputChange = (field: Tfields) => (value: string) => {
    setLocalState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLocalActionLoading(true);
      await loginAction(dispatch)(localState, selectedBank);
    } finally {
      setLocalActionLoading(false);
    }
  }

  const showHidePassword = () => {
    setShowPassword(prevState => !prevState)
  }

  const isAndroid = Platform.OS === "android";

  const winDi = Dimensions.get("window");

  const eyeOpen = ternaryResolver(isAndroid, "md-eye-sharp", "ios-eye-sharp");

  const eyeClosed = ternaryResolver(isAndroid, "md-eye-off", "ios-eye-off");

  return (
        <TouchableWithoutFeedback
          onPress={(e) => {
            if (e.target === modalRef1.current || e.target === modalRef2.current) {
              Keyboard.dismiss();
            }
          }}
        >
          <View
            ref={modalRef1}
            style={{
              position: "absolute",
              backgroundColor: colors.transparent,
              top: 0,
              bottom: 0,
              width: "100%",
              flex: 1,
            }}
          >
            <View
            ref={modalRef2}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.white,
                  maxHeight: ternaryResolver(
                    winDi.height / 2 < 400,
                    400,
                    winDi.height / 2.1
                  ),
                  width: winDi.width / 1.1,
                  justifyContent: "center",
                  paddingHorizontal: winDi.width / 15,
                  paddingBottom: winDi.width / 10,
                }}
              >
                <View style={{ alignItems: "flex-end", paddingTop: winDi.width / 20, paddingBottom: winDi.width / 25, }}>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name={isAndroid ? "md-close-sharp" : "ios-close-sharp"} size={winDi.width / 12} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    paddingBottom: winDi.height / 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: colors.secondary,
                      fontFamily: fonts.regular,
                      fontSize: winDi.width / 20,
                    }}
                  >
                    Enter your credentials
                  </Text>
                </View>
                <Box w="100%" style={{ marginBottom: 30 }}>
                  <Input
                    style={{ padding: 10 }}
                    onChangeText={handleInputChange("username")}
                    value={localState.username}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="off"
                    InputLeftElement={
                      <Icon
                        as={
                          <Ionicons
                            name={isAndroid ? "person" : "ios-person"}
                          />
                        }
                        size="sm"
                        m={2}
                        _light={{
                          color: colors.transparent,
                        }}
                      />
                  }
                    placeholder="Username"
                    _light={{
                      placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                      placeholderTextColor: "blueGray.50",
                    }}
                  />
                </Box>
                <Box w="100%" style={{ marginBottom: 30 }}>
                  <Input
                    style={{ padding: 10 }}
                    onChangeText={handleInputChange("password")}
                    value={localState.password}
                    secureTextEntry={!showPassword}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    InputLeftElement={
                        <Icon
                          as={
                            <Ionicons
                              name={isAndroid ? "md-lock-closed" : "ios-lock-closed"}
                            />
                          }
                          size="sm"
                          m={2}
                          _light={{
                            color: colors.transparent,
                          }}
                        />
                    }
                    InputRightElement={
                      <TouchableOpacity
                        onPress={showHidePassword}
                        activeOpacity={0.7}
                      >
                        <Icon
                          as={
                            <Ionicons
                              name={showPassword ? eyeOpen : eyeClosed}
                            />
                          }
                          size="sm"
                          m={2}
                          _light={{
                            color: colors.transparent,
                          }}
                        />
                      </TouchableOpacity>
                    }
                    placeholder="Password"
                    _light={{
                      placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                      placeholderTextColor: "blueGray.50",
                    }}
                  />
                </Box>

                <CustomButton2
                  onPress={handleSubmit}
                  text="Login"
                  loading={localActionLoading}
                  disabled={!localState.password || !localState.username}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  account: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  accountHeading: {
    fontSize: 18,
    fontFamily: "lato-regular",
  },
  phonebook: {
    width: "100%",
    paddingVertical: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  accountText: {
    fontSize: Dimensions.get("window").width / 25,
    fontFamily: fonts.regular,
    marginTop: Dimensions.get("window").height / 50,
  },
});

export default ManualLoginModal;
