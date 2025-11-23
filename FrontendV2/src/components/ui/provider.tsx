"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import * as React from "react";
import type { ReactNode } from "react";

export interface ColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  // add real color-mode logic here if you need it
  return <>{children}</>;
}

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
