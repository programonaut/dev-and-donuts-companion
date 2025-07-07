import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors";
import { TimeTableEntryType } from "./TimeTableEntry";

type BottomSheetContextType = {
  openSheet: (entry: TimeTableEntryType) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

export default function BottomSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimeTableEntryType | null>(
    null
  );

  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const [backdropVisible, setBackdropVisible] = useState(false);

  const openSheet = (entry: TimeTableEntryType) => {
    setSelectedEntry(entry);
    bottomSheetRef.current?.snapToIndex(0);
    setBackdropVisible(true);
  };

  return (
    <BottomSheetContext.Provider value={{ openSheet }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={({ style }) =>
          backdropVisible && (
            <View
              style={[style, { backgroundColor: Colors.black, opacity: 0.25 }]}
            />
          )
        }
        onClose={() => setBackdropVisible(false)}
        backgroundStyle={{ backgroundColor: Colors.backgroundSecondary }}
        handleIndicatorStyle={{ backgroundColor: Colors.textSecondary }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {selectedEntry && (
            <View>
              <Text style={styles.title}>{selectedEntry.title}</Text>
              <Text style={styles.time}>
                {selectedEntry.start} - {selectedEntry.end}
              </Text>
              {selectedEntry.speaker && (
                <View style={styles.speakerContainer}>
                  <Image
                    source={{ uri: selectedEntry.speaker.image }}
                    style={styles.speakerImage}
                  />
                  <Text style={styles.speakerName}>
                    {selectedEntry.speaker.name}
                  </Text>
                </View>
              )}
              <Text style={styles.description}>
                {selectedEntry.description}
              </Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.text,
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 16,
    color: Colors.textSecondary,
  },
  speakerContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 4,
  },
  speakerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  speakerName: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
