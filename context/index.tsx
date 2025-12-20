"use client";

import {ChildrenProps, ContextType, Lang} from "@/types";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import {TRANSLATIONS} from "@/lang";


export const Context = createContext<ContextType | null>(null);
const STORAGE_KEY = "rd_lang";

const GlobalContext = ({children}: ChildrenProps) => {
    const [loading, setLoading] = useState(false);
    const [lang, setLangState] = useState<Lang>("uz");

    useEffect(() => {
        const saved =
            typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved === "uz" || saved === "ru" || saved === "en") {
            setLangState(saved);
        } else if (typeof navigator !== "undefined") {
            const nav = navigator.language || "";
            if (nav.startsWith("ru")) setLangState("ru");
            else if (nav.startsWith("en")) setLangState("en");
            else setLangState("uz");
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, lang);
            try {
                document.documentElement.lang = lang;
            } catch (e) {
                // ignore
            }
        }
    }, [lang]);

    const setLang = useCallback((l: Lang) => {
        setLangState(l);
    }, []);

    const t = useCallback(
        (key: string) => {
            return TRANSLATIONS[lang]?.[key] ?? key;
        },
        [lang]
    );

    return (
        <Context.Provider value={{loading, lang, setLang, t}}>
            {children}
        </Context.Provider>
    );
};

export default GlobalContext;

export const useGlobalContext = () => {
    const context = useContext(Context);

    if (context === null) {
        throw new Error(
            "useGlobalContext must be used within a GlobalContext provider"
        );
    }
    return context;
};
