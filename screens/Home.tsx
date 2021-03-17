import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import WelcomeModal from "../components/WelcomeModal";
import colors from "../constants/colors";
import { LinkSvg, TransactionSvg, TransferSvg } from "../assets/icons/svgs";
const Home = ({ navigation }: React.ComponentProps<any>) => {
  const [modalVisible, setModalVisible] = useState(true);

  const menuCollection = [
    {
      name: "Link / Unlink",
      Icon: LinkSvg,
      screen: 'AccountNumberList'
    },
    {
      name: "Send Money",
      Icon: TransferSvg,
      screen: 'AccountNumberList'
    },
    {
      name: "Transactions History",
      Icon: TransactionSvg,
      screen: 'Home'
    },
  ];

  const iconSize = Dimensions.get("window").height / 30;

  const handleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  const handleNavigation = (nextScreen: string, triggerBtn: string) => {
      const isLinkUnlink = nextScreen === 'AccountNumberList' && triggerBtn === 'Link / Unlink';

      navigation.navigate({
        name: nextScreen,
        params: {
          isFirstTime: isLinkUnlink ? true : false,
          isLinking: isLinkUnlink
        }
      });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Send Money to Alias</Text>
        </View>

        <View style={styles.menus}>
          {menuCollection.map(({ name, Icon, screen }) => (
            <TouchableOpacity activeOpacity={0.5} style={styles.card} key={name} onPress={() => handleNavigation(screen, name)}>
              <View style={styles.cardIcon}>
                <Icon width={iconSize} height={iconSize} />
              </View>
              <Text style={styles.cardText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <WelcomeModal mode="dark" visible={modalVisible} handleModal={handleModal} />
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
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menus: {
    padding: Dimensions.get("window").width / 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "lato-regular",
  },
  card: {
    width: Dimensions.get("window").width / 2.5,
    padding: Dimensions.get("window").width / 20,
    paddingHorizontal: Dimensions.get("window").width / 40,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(231, 234, 240, 0.25)",
    borderRadius: 5,
    marginBottom: Dimensions.get("window").height / 30,
  },
  cardIcon: {
    overflow: "visible",
  },
  cardText: {
    color: colors.textColor,
    marginTop: 10,
    fontSize: Dimensions.get("window").width / 30,
  },
});

export default Home;
