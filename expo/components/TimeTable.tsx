import { RefreshControl, SectionList, Text, View } from "react-native";
import { TimeTableEntry, TimeTableEntryType } from "./TimeTableEntry";
import { Colors } from "../constants/colors";

export type EventType = {
  name: string;
  structure: EventStructure;
};

export type EventStructure = {
  timetable: TimeTableType;
};

export type TimeTableType = TimeTableEntryType[];

export const TimeTable = (props: {
  timeTable: TimeTableType;
  onEntryPress: (entry: TimeTableEntryType) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}) => {
  const timeTableData = props.timeTable.map((event) => {
    return {
      title: event.start,
      data: [event],
    };
  });

  return (
    <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "medium",
          textDecorationLine: "underline",
          marginBottom: -12,
          color: Colors.text,
        }}
      >
        Schedule
      </Text>
      <SectionList
        sections={timeTableData}
        keyExtractor={(item, index) => item.title + index.toString()}
        renderItem={({ item }) => (
          <TimeTableEntry
            entry={item}
            onPress={() => props.onEntryPress(item)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={{ marginTop: 20, marginBottom: 4, color: Colors.text }}>
            {section.title}
          </Text>
        )}
        contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          props.onRefresh ? (
            <RefreshControl
              refreshing={props.refreshing || false}
              onRefresh={props.onRefresh}
            />
          ) : undefined
        }
      />
    </View>
  );
};
