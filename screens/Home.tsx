import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import WelcomeModal from "../components/WelcomeModal";
import colors from "../constants/colors";
import { LinkSvg, UnlinkSvg, TransferSvg } from "../assets/icons/svgs";
import fonts from "../constants/fonts";

const Home = ({ navigation, selectedBank }: React.ComponentProps<any>) => {
  const [modalVisible, setModalVisible] = useState(true);

  const menuCollection = [
    {
      name: "Send Money",
      Icon: TransferSvg,
      screen: "AccountNumberList",
    },
    {
      name: "Link Alias",
      Icon: LinkSvg,
      screen: "AccountNumberList",
    },
    {
      name: "Unlink Alias",
      Icon: UnlinkSvg,
      screen: "AccountNumberList",
    },
  ];

  const iconSize = Dimensions.get("window").height / 30;

  const handleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  const handleNavigation = (nextScreen: string, triggerBtn: string) => {
    const isLinkUnlink =
      nextScreen === "AccountNumberList" && triggerBtn === "Link / Unlink";

    navigation.navigate({
      name: nextScreen,
      params: {
        isFirstTime: isLinkUnlink ? true : false,
        isLinking: isLinkUnlink,
      },
    });
  };

  if (modalVisible && !!selectedBank) {
    return (
      <WelcomeModal
        data={selectedBank}
        mode="dark"
        visible
        handleModal={handleModal}
      />
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Quick actions</Text>
        </View>

        <View style={styles.cardContainer}>
          {menuCollection.map(({ name, Icon, screen }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.card}
              key={name}
              onPress={() => handleNavigation(screen, name)}
            >
              <View style={styles.cardIcon}>
                <Icon width={iconSize} height={iconSize} />
              </View>
              <Text style={styles.cardText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
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
