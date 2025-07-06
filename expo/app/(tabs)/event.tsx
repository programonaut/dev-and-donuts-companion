import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";
import { useBottomSheet } from "../../components/BottomSheetContext";
import { TimeTable } from "../../components/TimeTable";
import { TimeTableEntryType } from "../../components/TimeTableEntry";
import { Colors } from "../../constants/colors";
import * as schema from "../../db/schema";
import { events } from "../../db/schema";
import { useEffect, useState } from "react";
import type { EventType } from "../../components/TimeTable";

export default function Index() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  const [data, setData] = useState<EventType | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const { openSheet } = useBottomSheet();

  const handleEntryPress = (entry: TimeTableEntryType) => {
    openSheet(entry);
  };

  const fetchData = async () => {
    console.log("fetching data");
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/events`
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        setData(data.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: Colors.background,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{data?.name}</Text>
      <TimeTable
        timeTable={data?.structure.timetable || []}
        onEntryPress={handleEntryPress}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
