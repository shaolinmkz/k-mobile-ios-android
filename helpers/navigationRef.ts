import * as React from "react"

export const navigationRef = React.createRef<any>();


export const navigate = (routeName?: any, params?: any) => {
  if (navigationRef?.current) {
    navigationRef?.current?.navigate(routeName, params);
  }
};

export class NavigationRef {
  static navigationRef: any = undefined;


  static setRef(ref: any) {
    this.navigationRef = ref
  }
}

export const replace = (routeName?: any, params?: any) => {
  if (NavigationRef?.navigationRef) {
    NavigationRef?.navigationRef?.replace(routeName, params);
  }
};
