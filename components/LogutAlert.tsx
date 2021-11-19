import React, { useRef } from "react";
import { AlertDialog, Button, Center } from "native-base";
import { Text } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import useAppState from "../hooks/useAppState";
import { SET_LOGOUT_MODAL } from "../redux/types";
import { logoutAction } from "../redux/actions";

const DialogAlert = () => {
  const cancelRef = useRef(null);
  const { dispatch, logoutModalOpen } = useAppState();

  const onClose = () => {
    dispatch({ type: SET_LOGOUT_MODAL, payload: false });
  };

  const handleLogout = () => {
    onClose();
    logoutAction(dispatch);
  };

  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={logoutModalOpen}
        onClose={onClose}
      >
        <AlertDialog.Content style={{ padding: 10 }}>
          <AlertDialog.Header>Logout</AlertDialog.Header>
          <AlertDialog.Body>Are you sure?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              onPress={onClose}
              style={{
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.secondary,
              }}
            >
              <Text
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.regular,
                  fontSize: 16,
                }}
              >
                CANCEL
              </Text>
            </Button>
            <Button
              style={{ backgroundColor: colors.primary }}
              onPress={handleLogout}
              ml={3}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: fonts.regular,
                  fontSize: 16,
                }}
              >
                LOGOUT
              </Text>
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default DialogAlert;
