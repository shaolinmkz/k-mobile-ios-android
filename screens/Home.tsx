import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import WelcomeModal from "../components/WelcomeModal";
import colors from "../constants/colors";
import {
  LinkBoldSvg,
  UnlinkSvg,
  TransferSvg,
  RefreshSvg,
} from "../assets/icons/svgs";
import fonts from "../constants/fonts";
import {
  fetchUserIdLinkedToBVNAction,
  handleFetchMaxTransferAmount,
  handleFetchReversalDuration,
  handleVerifyUser,
} from "../redux/actions";
import PageLoader from "../components/PageLoader";
import DialogAlert from "../components/LogutAlert";
import { SET_SPLASH_SCREEN, SET_WELCOME_MODAL } from "../redux/types";
import { ternaryResolver } from "../helpers";
import SplashScreen from "../components/SplashScreen";
import useAppState from "../hooks/useAppState";
import {
  INDEPENDENT_LINKING,
  INDEPENDENT_UNLINKING,
  INITIAL_LINKING,
  SEND_MONEY,
} from "../constants/actions";

const Home = ({
  navigation,
}: React.ComponentProps<any>) => {
  const {
    dispatch,
    selectedBank,
    userExist,
    pageLoading,
    showWelcomeModal,
    splashScreenOpen,
  } = useAppState();

  const menuCollection = [
    {
      action: ternaryResolver(userExist, SEND_MONEY, INITIAL_LINKING),
      name: "Send Money",
      Icon: TransferSvg,
      screen: "AccountNumberList",
      show: true,
    },
    {
      action: INDEPENDENT_LINKING,
      name: "Link Alias",
      Icon: LinkBoldSvg,
      screen: "AccountNumberList",
      show: true,
    },
    {
      action: INDEPENDENT_UNLINKING,
      name: "Unlink Alias",
      Icon: UnlinkSvg,
      screen: "AccountNumberList",
      show: userExist,
    },
  ];

  const iconSize = Dimensions.get("window").height / 30;

  const handleModal = (value = false) => {
    dispatch({ type: SET_WELCOME_MODAL, payload: value });
  };

  const handleNavigation = ({ screen, action }: any) => {
    navigation.navigate({
      name: screen,
      params: {
        action,
      },
    });
  };

  const initializeDataFetch = (pageLoading = true) => {
    handleVerifyUser(dispatch, pageLoading)();
    handleFetchMaxTransferAmount(dispatch);
    fetchUserIdLinkedToBVNAction(dispatch);
    handleFetchReversalDuration(dispatch);
  };

  const reloadApp = () => {
    dispatch({ type: SET_SPLASH_SCREEN, payload: true });
    initializeDataFetch();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeDataFetch(userExist === null);
    });

    return unsubscribe;
  }, [navigation, userExist]);

  if (splashScreenOpen) {
    return <SplashScreen timeout={5000} logo={selectedBank?.appIcon} />;
  } else if (pageLoading) {
    return <PageLoader />;
  } else if (!pageLoading) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Quick actions</Text>
          </View>

          <View style={styles.cardContainer}>
            {userExist !== null && (
              <>
                {menuCollection.map(({ name, Icon, screen, action, show }) => show && (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.card}
                    key={name}
                    onPress={() => handleNavigation({ screen, name, action })}
                  >
                    <View style={styles.cardIcon}>
                      <Icon width={iconSize} height={iconSize} />
                    </View>
                    <Text style={styles.cardText}>{name}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            <DialogAlert />
            {userExist === null && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: "column",
                  paddingHorizontal: Dimensions.get("window").width / 40,
                  paddingVertical: Dimensions.get("window").width / 10,
                  width: "100%",
                  borderBottomWidth: 1,
                  borderColor: colors.line,
                  alignItems: "center",
                }}
                key="refresh"
                onPress={reloadApp}
              >
                <View style={{ overflow: "visible", alignItems: "center" }}>
                  <RefreshSvg
                    width={Dimensions.get("window").width / 10}
                    height={Dimensions.get("window").width / 10}
                  />
                </View>
                <Text style={{ ...styles.cardText, textAlign: "center" }}>
                  Please Tap Here
                </Text>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: "center",
                    fontSize: 14,
                    color: colors.primary,
                  }}
                >
                  Something went wrong!
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showWelcomeModal && !!selectedBank && (
          <WelcomeModal
            data={selectedBank}
            mode="light"
            visible
            onClose={() => handleModal(false)}
          />
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    width: "100%",
    paddingVertical: Dimensions.get("window").width / 10,
    paddingHorizontal: Dimensions.get("window").width / 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.line,
  },
  cardContainer: {
    padding: Dimensions.get("window").width / 15,
  },
  headerText: {
    fontSize: Dimensions.get("window").width / 17,
    fontFamily: fonts.regular,
    color: colors.secondary,
  },
  card: {
    height: Dimensions.get("window").width / 4,
    paddingHorizontal: Dimensions.get("window").width / 40,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    overflow: "visible",
    marginRight: Dimensions.get("window").width / 10,
  },
  cardText: {
    color: colors.secondary,
    marginTop: 10,
    fontSize: Dimensions.get("window").width / 20,
    fontFamily: fonts.regular,
  },
});

export default Home;
