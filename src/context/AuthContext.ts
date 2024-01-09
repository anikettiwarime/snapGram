import { INITIAL_STATE } from "@/constants";
import { IContextType } from "@/types";
import { createContext, useContext } from "react";

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const useUserContext = () => useContext(AuthContext);
