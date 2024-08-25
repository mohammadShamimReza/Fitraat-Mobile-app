import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";



import { useColorScheme } from "@/hooks/useColorScheme";
import Providers from "@/lib/Providers";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://f6965269ba26e03763e2a1e78ea18d02@o4507836331655168.ingest.de.sentry.io/4507836333490256',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("Fonts loaded successfully.");
      SplashScreen.hideAsync();
    } else {
      console.log("Fonts not yet loaded.");
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Ensure not to render until fonts are loaded.
  }

return (
  <Providers>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  </Providers>
);
}
