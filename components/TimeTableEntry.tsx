import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

export type TimeTableEntryType = {
  title: string;
  summary: string;
  description: string;
  start: string;
  end: string;
};

export const TimeTableEntry = (props: { entry: TimeTableEntryType }) => {
  return (
    <View
      style={{
        borderRadius: 10,
        padding: 10,
        backgroundColor: Colors.card,
        shadowColor: Colors.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        {props.entry.title}
      </Text>
      <Text style={{ fontSize: 14 }}>{props.entry.summary}</Text>
    </View>
  );
};
