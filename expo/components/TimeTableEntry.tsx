import { Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

export type TimeTableEntryType = {
  title: string;
  speaker?: {
    name: string;
    image: string;
  };
  summary: string;
  description: string;
  start: string;
  end: string;
};

export const TimeTableEntry = (props: {
  entry: TimeTableEntryType;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        borderRadius: 10,
        padding: 10,
        backgroundColor: Colors.backgroundSecondary,
        shadowColor: Colors.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.text }}>
        {props.entry.title}
      </Text>
      {props.entry.speaker && (
        <Text
          style={{ fontSize: 14, marginBottom: 4, color: Colors.textTertiary }}
        >
          {props.entry.speaker.name}
        </Text>
      )}
      <Text style={{ fontSize: 14, color: Colors.text }}>
        {props.entry.summary}
      </Text>
    </TouchableOpacity>
  );
};
