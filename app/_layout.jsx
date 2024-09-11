import { Stack } from "expo-router";
import { SettingsProvider } from "./context/SettingContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppProvider } from "./context/AppContext";
export default function RootLayout() {
  return (
    <AppProvider>
      <SettingsProvider>
        <Stack
          screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
        >
          <Stack.Screen name="pages/login" />
          <Stack.Screen name="pages/main" />
          <Stack.Screen name="components/logs/Logs" />
          <Stack.Screen
            name="pages/report"
            options={{
              headerShown: true,
              fullScreenGestureEnabled: true,
              title: "Report",
            }}
          />
          <Stack.Screen
            name="pages/setting"
            options={{
              headerShown: true,
              fullScreenGestureEnabled: true,
              title: "Setting",
            }}
          />
        </Stack>
      </SettingsProvider>
    </AppProvider>
  );
}
