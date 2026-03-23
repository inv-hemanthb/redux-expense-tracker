import type { ReactNode } from "react";

export type HeaderMode = "public" | "app";

export interface BaseLayoutProps {
    children: ReactNode;
    headerMode: HeaderMode;
}
