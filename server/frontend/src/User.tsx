import { createContext } from "react";

const initialState = {
    name: "nice",
    currentPage: "home",
    darkMode: false,
    defaultValue: "",
};

const UserContext = createContext(initialState);
export default UserContext;
