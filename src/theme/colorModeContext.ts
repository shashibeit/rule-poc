import { createContext, useContext } from 'react';
import type { PaletteMode } from '@mui/material';

export interface ColorModeContextValue {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => undefined,
});

export const useColorMode = () => useContext(ColorModeContext);
