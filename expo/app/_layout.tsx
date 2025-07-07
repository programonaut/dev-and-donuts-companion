import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, StyleSheet, ImageBackground } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BottomSheetProvider from "../components/BottomSheetContext";
import { Colors } from "../constants/colors";
import migrations from "../drizzle/migrations";

export const DATABASE_NAME = "devanddonutscompanion";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  return (
    <GestureHandlerRootView>
      <BottomSheetProvider>
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense
          >
            <SafeAreaProvider>
              <ImageBackground
                source={{
                  uri: "https://yasoon.de/wp-content/uploads/2025/01/Dev-and-Donuts_BG-4K-scaled.webp",
                }}
                style={styles.container}
                resizeMode="cover"
              >
                <SafeAreaView
                  style={styles.container}
                  edges={["top", "left", "right"]}
                >
                  <Stack
                    screenOptions={{
                      contentStyle: { backgroundColor: "transparent" },
                    }}
                  >
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{
                        headerShown: false,
                      }}
                    />
                  </Stack>
                </SafeAreaView>
              </ImageBackground>
            </SafeAreaProvider>
          </SQLiteProvider>
        </Suspense>
      </BottomSheetProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
