import { useDispatch, useSelector } from "react-redux";
import { IAppState, IInitialState } from "../Interfaces";
import * as ActionTypes from "../redux/types";

const useAppState = () => {
  const dispatch = useDispatch();

  const appState: IInitialState = useSelector(
    (state: IAppState) => state.appState
  );

  return { ...appState, dispatch, ...ActionTypes }
}

export default useAppState;
