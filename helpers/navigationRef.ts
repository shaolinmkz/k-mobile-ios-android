import * as React from "react"

export const navigationRef = React.createRef<any>();


export const navigate = (routeName?: any, params?: any) => {
  if (navigationRef?.current) {
    navigationRef?.current?.navigate(routeName, params);
  }
};

export class DispatchRef {
  static dispatchRef = (data: any) => data;


  static setDispatch(dispatch: any) {
    this.dispatchRef = dispatch ? dispatch : (data: any) => data;
  }

  static dispatch(action: any) {
    this.dispatchRef(action);
  }
}

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

export const navigation = () => {
  return NavigationRef?.navigationRef
};
