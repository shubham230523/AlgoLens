import { useWindowDimensions } from 'react-native';
import { Breakpoints } from '@/constants/theme';

export function useAdaptiveLayout() {
  const { width } = useWindowDimensions();

  const isPhone = width < Breakpoints.TABLET;
  const isTablet = width >= Breakpoints.TABLET && width < Breakpoints.DESKTOP;
  const isDesktop = width >= Breakpoints.DESKTOP;

  const getColumns = (phoneCols = 1, tabletCols = 2, desktopCols = 3) => {
    if (isDesktop) return desktopCols;
    if (isTablet) return tabletCols;
    return phoneCols;
  };

  const contentPadding = isPhone ? 16 : isTablet ? 24 : 32;

  return {
    width,
    isPhone,
    isTablet,
    isDesktop,
    getColumns,
    contentPadding,
  };
}
