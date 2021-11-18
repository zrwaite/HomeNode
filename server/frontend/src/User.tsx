import { createContext } from "react";

const initialState = {
  name: "",
  username: "",
  userID: "",
  homeID: "",
  currentPage: "home",
  darkMode: false,
  defaultValue: "",
};

const UserContext = createContext(initialState);
export default UserContext;
