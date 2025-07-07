import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  RefreshControl,
  TouchableHighlight,
} from "react-native";
import Dropdown from "react-native-input-select";
import uuid from "react-native-uuid";
import { Colors } from "../../constants/colors";
import * as schema from "../../db/schema";
import { data } from "../../db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";

export type Questionnaire = {
  name: string;
  technicalDomain:
    | "web_development"
    | "mobile_development"
    | "ai"
    | "cloud_computing"
    | "devops"
    | "security"
    | "other"
    | undefined;
  technicalDomainOther: string;
  tonight: string;
  sideProject: string;
  helpSkill: string;
  nonSoftware: string;
};

export const defaultQuestionnaire: Questionnaire = {
  name: "",
  technicalDomain: undefined,
  technicalDomainOther: "",
  tonight: "",
  sideProject: "",
  helpSkill: "",
  nonSoftware: "",
};

export type Match = {
  user1: string;
  user2: string;
  reason: string;
  emoji1: string;
  emoji2: string;
  icebreakers: string[];
};

export default function Index() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  const { data: userData, updatedAt } = useLiveQuery(
    drizzleDb.select().from(data).limit(1)
  );

  const [match, setMatch] = useState<Match | null>(null);

  const [clickedEmptySpace, setClickedEmptySpace] = useState<number>(0);

  const startMatching = async () => {
    console.log("startMatching in " + (2 - clickedEmptySpace));
    const newClickedEmptySpace = clickedEmptySpace + 1;
    setClickedEmptySpace(newClickedEmptySpace);
    if (newClickedEmptySpace === 3) {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/matches/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await fetchMatch();
    }
  };

  const fetchMatch = async () => {
    const uniqueId = userData[0].uniqueId;

    const match = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/matches/${uniqueId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const matchData = await match.json();
    console.log(matchData.data[0]);
    setMatch(matchData.data[0] ?? undefined);
  };

  const handleSubmit = async () => {
    const validQuestionnaire =
      questionnaire.name !== "" &&
      questionnaire.technicalDomain !== undefined &&
      questionnaire.tonight !== "" &&
      questionnaire.sideProject !== "" &&
      questionnaire.helpSkill !== "" &&
      questionnaire.nonSoftware !== "";

    if (!validQuestionnaire) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const uniqueId = userData[0].uniqueId;

    await drizzleDb
      .update(data)
      .set({ answers: questionnaire })
      .where(eq(data.uniqueId, uniqueId));

    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/${uniqueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers: questionnaire }),
    });

    setShowQuestionnaire(false);

    // in production this step will be done asynchronously one day before the event
    // and the user will be notified via push notification
    await fetchMatch();
  };

  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [questionnaire, setQuestionnaire] =
    useState<Questionnaire>(defaultQuestionnaire);

  useEffect(() => {
    if (userData.length === 0) {
      (async () => {
        const user = await drizzleDb.select().from(data).limit(1);
        if (user.length === 0) {
          console.log("inserting user");
          await drizzleDb.insert(data).values({ uniqueId: uuid.v4() });
        }
      })();
    } else {
      (async () => {
        const user = userData[0];
        if (user.answers === null || !user.answers) {
          setShowQuestionnaire(true);
        } else {
          setQuestionnaire(user.answers);
          setShowQuestionnaire(false);
          await fetchMatch();
        }
      })();
    }
  }, [userData, updatedAt]);

  return (
    <ScrollView
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
        overflowY: "scroll",
      }}
    >
      {showQuestionnaire ? (
        <Questionnaire
          questionnaire={questionnaire}
          setQuestionnaire={setQuestionnaire}
          onSubmit={handleSubmit}
        />
      ) : !match ? (
        <WaitingScreen
          questionnaire={questionnaire}
          setQuestionnaire={setQuestionnaire}
          onSubmit={handleSubmit}
          startMatching={startMatching}
        />
      ) : (
        <Match match={match} fetchMatch={fetchMatch} />
      )}
    </ScrollView>
  );
}

const Questionnaire = ({
  questionnaire,
  setQuestionnaire,
  onSubmit,
}: {
  questionnaire: Questionnaire;
  setQuestionnaire: (questionnaire: Questionnaire) => void;
  onSubmit: () => void;
}) => {
  return (
    <View>
      <Text style={styles.title}>Questionnaire</Text>
      <Text style={styles.description}>
        Match with other developers interested in the same topics as you. Get a
        15min slot after the presentations to get to know each other and see if
        it sparks something.
      </Text>
      <View style={styles.seperator} />
      <Text style={styles.label}>What is your name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={Colors.textPlaceholder}
        value={questionnaire.name}
        onChangeText={(text) =>
          setQuestionnaire({ ...questionnaire, name: text })
        }
      />
      <Text style={styles.label}>
        Which technical domains excite you the most (choose up to 3)
      </Text>
      <Dropdown
        dropdownStyle={styles.dropdown}
        selectedItemStyle={{
          minHeight: 20,
          margin: 0,
        }}
        placeholderStyle={{
          color: Colors.textPlaceholder,
        }}
        multipleSelectedItemStyle={{
          backgroundColor: Colors.backgroundSecondary,
          color: Colors.text,
        }}
        dropdownIconStyle={{
          top: 10,
          right: 10,
        }}
        dropdownIcon={
          <Ionicons name="chevron-down" size={24} color={Colors.text} />
        }
        options={[
          { label: "Web Development", value: "web_development" },
          { label: "Mobile Development", value: "mobile_development" },
          { label: "AI", value: "ai" },
          { label: "Cloud Computing", value: "cloud_computing" },
          { label: "DevOps", value: "devops" },
        ]}
        isMultiple
        listControls={{
          hideSelectAll: true,
        }}
        minSelectableItems={1}
        maxSelectableItems={3}
        selectedValue={questionnaire.technicalDomain}
        onValueChange={(value) =>
          setQuestionnaire({
            ...questionnaire,
            technicalDomain: value as Questionnaire["technicalDomain"],
          })
        }
        modalControls={{
          modalOptionsContainerStyle: {
            backgroundColor: Colors.backgroundSecondary,
            borderColor: Colors.text,
          },
        }}
        checkboxControls={{
          checkboxStyle: {
            backgroundColor: Colors.backgroundSecondary,
            borderColor: Colors.text,
          },
          checkboxLabelStyle: {
            color: Colors.text,
          },
        }}
      />
      <Text style={styles.label}>Tonight I am hoping to...</Text>
      <TextInput
        style={styles.multilineInput}
        placeholder="I am hoping to..."
        placeholderTextColor={Colors.textPlaceholder}
        value={questionnaire.tonight}
        onChangeText={(text) =>
          setQuestionnaire({ ...questionnaire, tonight: text })
        }
        multiline
      />
      <Text style={styles.label}>
        Describe a project, side-project or experiment you are proud of
      </Text>
      <TextInput
        style={styles.multilineInput}
        placeholder="I have built..."
        placeholderTextColor={Colors.textPlaceholder}
        value={questionnaire.sideProject}
        onChangeText={(text) =>
          setQuestionnaire({ ...questionnaire, sideProject: text })
        }
        multiline
      />
      <Text style={styles.label}>
        One topic or skill you could help others with tonight
      </Text>
      <TextInput
        style={styles.multilineInput}
        placeholder="I can help you with..."
        placeholderTextColor={Colors.textPlaceholder}
        value={questionnaire.helpSkill}
        onChangeText={(text) =>
          setQuestionnaire({ ...questionnaire, helpSkill: text })
        }
        multiline
      />
      <Text style={styles.label}>
        Non-software topic you could nerd-out about for 5 minutes
      </Text>
      <TextInput
        style={styles.multilineInput}
        placeholder="3D Printing, Cooking, etc."
        placeholderTextColor={Colors.textPlaceholder}
        value={questionnaire.nonSoftware}
        onChangeText={(text) =>
          setQuestionnaire({ ...questionnaire, nonSoftware: text })
        }
        multiline
      />
      <Button
        title="Submit"
        onPress={onSubmit}
        color={Colors.buttonBackground}
      />
      <View style={{ marginBottom: 40 }} />
    </View>
  );
};

const Match = ({
  match,
  fetchMatch,
}: {
  match: Match | null;
  fetchMatch: () => void;
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.title}>Your meetup</Text>
      <Text style={styles.description}>
        After the presentation, you&apos;ll get a 15 min slot to connect and
        spark something great.
      </Text>

      <View style={styles.seperator} />

      <Text style={styles.matchNames}>
        {getFirstName(match?.user1 || "")}{" "}
        <Text style={styles.meetsText}>meets</Text>{" "}
        {getFirstName(match?.user2 || "")}
      </Text>

      <View style={styles.seperator} />

      <Text style={styles.reasonTitle}>Why you&apos;ll hit it off:</Text>
      <Text style={styles.reason}>{match?.reason}</Text>

      <View style={styles.seperator} />

      <Text style={styles.suggestionsTitle}>Suggested icebreakers:</Text>
      {match?.icebreakers?.map((icebreaker, index) => (
        <View key={index} style={styles.suggestionItem}>
          <Text style={styles.suggestionText}>{icebreaker}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

const WaitingScreen = ({
  questionnaire,
  setQuestionnaire,
  startMatching,
  onSubmit,
}: {
  questionnaire: Questionnaire;
  setQuestionnaire: (questionnaire: Questionnaire) => void;
  startMatching: () => void;
  onSubmit: () => void;
}) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  if (showUpdateForm) {
    return (
      <Questionnaire
        questionnaire={questionnaire}
        setQuestionnaire={setQuestionnaire}
        onSubmit={() => {
          onSubmit();
          setShowUpdateForm(false);
        }}
      />
    );
  }

  return (
    <View style={styles.waitingContainer}>
      <Text style={styles.waitingEmoji}>⏳</Text>
      <Text style={styles.waitingTitle}>Waiting to be matched...</Text>
      <Text style={styles.waitingDescription}>
        Thanks for filling out your profile! We&apos;re working on finding you
        the perfect match. This usually takes a few minutes.
      </Text>

      <View style={styles.seperator} />
      <Button
        title="Update my profile"
        onPress={() => setShowUpdateForm(true)}
        color={Colors.buttonBackground}
      />

      <Text style={styles.refreshHint}>
        Pull down to refresh and check for new matches
      </Text>

      <TouchableHighlight
        onPress={() => {
          startMatching();
        }}
        style={{
          marginTop: 64,
        }}
        underlayColor={"transparent"}
      >
        <Text style={styles.demoHint}>
          DEMO: Press this text three times to start the matching process
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Simplified vibrant styles
  matchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  meetsText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginHorizontal: 16,
  },
  matchNames: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.text,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.text,
  },
  reason: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.text,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  suggestionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  // Waiting screen styles
  updateHeader: {
    marginBottom: 20,
  },
  waitingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  waitingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  waitingDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  profilePreview: {
    width: "100%",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  profileDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  profileLabel: {
    fontWeight: "600",
    color: Colors.text,
  },
  refreshHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  demoHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  // Legacy styles for questionnaire
  matchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  match: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  seperator: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: Colors.text,
  },
  multilineInput: {
    textAlignVertical: "top",
    height: 100,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: Colors.text,
  },
  dropdown: {
    backgroundColor: "transparent",
    borderColor: Colors.gray200,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    minHeight: 0,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: Colors.text,
  },
  selectedItem: {
    fontSize: 16,
  },
});
