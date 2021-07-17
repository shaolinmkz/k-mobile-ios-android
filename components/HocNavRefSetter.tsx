import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavigationRef } from "../helpers/navigationRef";
import { IInitialState, IAppState } from "../Interfaces";

interface IProps {
  component: any;
  navigation: any;
}

const HocNavRefSetter = (props: IProps) => {
  const { component: Component, ...rest } = props;

  const appState: IInitialState = useSelector(
    (state: IAppState) => state.appState
  );

  const customProps = {
    ...rest,
    ...appState,
  }

  useEffect(() => {
    NavigationRef.setRef(props.navigation);
  }, []);

  return <Component {...customProps} />;
};

export default HocNavRefSetter;
