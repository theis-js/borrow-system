"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import * as React from "react";
import type { ReactNode } from "react";
import { ColorModeProvider as ThemeColorModeProvider } from "./color-mode";

export interface ColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  // Wrap children with the real color-mode provider
  return <ThemeColorModeProvider>{children}</ThemeColorModeProvider>;
}

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
