import { TimeTable } from "@/components/TimeTable";
import { TimeTableEntryType } from "@/components/TimeTableEntry";
import { Colors } from "@/constants/colors";
import * as schema from "@/db/schema";
import { events } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";
import { useBottomSheet } from "../contexts/BottomSheetContext";

export default function Index() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  const { data } = useLiveQuery(drizzleDb.select().from(events));
  const { openSheet } = useBottomSheet();

  const handleEntryPress = (entry: TimeTableEntryType) => {
    openSheet(entry);
  };

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
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{data[0]?.name}</Text>
      <TimeTable
        timeTable={data.length === 0 ? [] : data[0]?.structure.timetable}
        onEntryPress={handleEntryPress}
      />
    </View>
  );
}
