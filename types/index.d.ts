import type { ReactNode } from "react";

export type Lang = 'uz' | 'ru' | 'en';

export interface ContextType {
    loading: boolean;
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: string) => string;
}

export interface ChildrenProps {
    children: ReactNode
}
