import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import Welcome from "../components/Welcome";
import colors from "../constants/colors";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const menuCollection = [
    {
      name: "Link / Unlink",
      icon: require("../assets/icons/link.png"),
    },
    {
      name: "Send Money",
      icon: require("../assets/icons/transfer.png"),
    },
    {
      name: "Transactions History",
      icon: require("../assets/icons/transactions.png"),
    },
  ];

  const iconSize = Dimensions.get("window").height / 30;

  const handleModal = () => {
    setModalVisible(prevState => !prevState)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Send Money to Alias</Text>
      </View>

      <View style={styles.menus}>
        {menuCollection.map(({ name, icon }) => (
          <TouchableOpacity style={styles.card} key={name}>
            <Image source={icon} style={styles.cardIcon} height={iconSize} width={iconSize} />
            <Text style={styles.cardText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Welcome mode="light" visible={modalVisible} handleModal={handleModal} />
    </View>
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
    fontSize: 22,
    fontFamily: "lato-regular",
  },
  card: {
    width: Dimensions.get("window").width / 2.5,
    padding: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(231, 234, 240, 0.25)",
    borderRadius: 5,
    marginBottom: 30,
  },
  cardIcon: {
    overflow: 'visible',
  },
  cardText: {
    color: colors.textColor,
    marginTop: 10,
    fontSize: Dimensions.get("window").width / 28
  },
});

export default Home;
