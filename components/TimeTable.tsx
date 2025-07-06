import { SectionList, Text, View } from "react-native";
import { TimeTableEntry, TimeTableEntryType } from "./TimeTableEntry";

export type EventStructure = {
  timetable: TimeTableType;
};

export type TimeTableType = TimeTableEntryType[];

export const TimeTable = (props: {
  timeTable: TimeTableType;
  onEntryPress: (entry: TimeTableEntryType) => void;
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
          <Text style={{ marginTop: 20, marginBottom: 4 }}>
            {section.title}
          </Text>
        )}
      />
    </View>
  );
};
