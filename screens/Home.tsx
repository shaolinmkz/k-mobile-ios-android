import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { handleVerifyUser } from "../redux/actions";
import PageLoader from "../components/PageLoader";
import { SET_SPLASH_SCREEN, SET_WELCOME_MODAL } from "../redux/types";
import { ternaryResolver } from "../helpers";
import SplashScreen from "../components/SplashScreen";

const Home = ({
  navigation,
  selectedBank,
  userExist,
  pageLoading,
  showWelcomeModal,
  splashScreenOpen,
}: React.ComponentProps<any>) => {
  const dispatch = useDispatch();

  const menuCollection = [
    {
      action: ternaryResolver(userExist, "SEND_MONEY", "INITIAL_LINKING"),
      name: "Send Money",
      Icon: TransferSvg,
      screen: "AccountNumberList",
    },
    {
      action: "INDEPENDENT_LINKING",
      name: "Link Alias",
      Icon: LinkBoldSvg,
      screen: "AccountNumberList",
    },
    {
      action: "INDEPENDENT_UNLINKING",
      name: "Unlink Alias",
      Icon: UnlinkSvg,
      screen: "AccountNumberList",
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

  const handleSplashScreen = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    })
  }

  useEffect(() => {
    handleVerifyUser(dispatch)();

    handleSplashScreen(2000).finally(() => {
      dispatch({ type: SET_SPLASH_SCREEN, payload: false })
    });
  }, []);

  if (splashScreenOpen) {
    return (
      <SplashScreen logo={selectedBank?.appIcon} />
    );
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
                {menuCollection.map(({ name, Icon, screen, action }) => (
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

            {userExist === null && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.card}
                key="refresh"
                onPress={() => handleVerifyUser(dispatch)()}
              >
                <View style={styles.cardIcon}>
                  <RefreshSvg width={iconSize} height={iconSize} />
                </View>
                <Text style={styles.cardText}>Tap To Refresh</Text>
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
    color: colors.textColor,
    marginTop: 10,
    fontSize: Dimensions.get("window").width / 20,
    fontFamily: fonts.regular,
  },
});

export default Home;
