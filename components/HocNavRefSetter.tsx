import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationRef, DispatchRef } from "../helpers/navigationRef";
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

  const dispatch = useDispatch();

  const customProps = {
    ...rest,
    ...appState,
  }

  useEffect(() => {
    NavigationRef.setRef(props.navigation);
    DispatchRef.setDispatch(dispatch);
  }, []);

  return <Component {...customProps} />;
};

export default HocNavRefSetter;
