import { createContext } from "react";

const initialState = {
  currentPage: "home",
  defaultValue: "",
};

const UserContext = createContext(initialState);
export default UserContext;
