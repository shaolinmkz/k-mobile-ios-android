import React, { useEffect } from "react";
import { NavigationRef } from "../helpers/navigationRef";

interface IProps {
  component: any;
  navigation: any;
}

const HocNavRefSetter = (props: IProps) => {
  const { component: Component, ...rest } = props;

  useEffect(() => {
    NavigationRef.setRef(props.navigation);
  }, []);

  return <Component {...rest} />;
};

export default HocNavRefSetter;
