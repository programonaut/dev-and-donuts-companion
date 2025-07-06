import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Dropdown from "react-native-input-select";
import uuid from "react-native-uuid";
import { Colors } from "../../constants/colors";
import * as schema from "../../db/schema";
import { data, users } from "../../db/schema";

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

export default function Index() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  useDrizzleStudio(db);

  const { data: userData } = useLiveQuery(
    drizzleDb
      .select()
      .from(data)
      .leftJoin(users, eq(data.id, users.id))
      .limit(1)
  );

  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [questionnaire, setQuestionnaire] =
    useState<Questionnaire>(defaultQuestionnaire);

  useEffect(() => {
    if (userData.length === 0) {
      (async () => {
        await drizzleDb.insert(data).values({ uniqueIdentifier: uuid.v4() });
      })();
    } else {
      const user = userData[0];
      if (user.users === null || !user.users.answers) {
        setShowQuestionnaire(true);
      } else {
        setQuestionnaire(user.users.answers);
        setShowQuestionnaire(false);
      }
    }
  }, [userData]);

  return (
    <ScrollView
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: Colors.background,
        overflowY: "scroll",
      }}
    >
      {showQuestionnaire ? (
        <Questionnaire
          questionnaire={questionnaire}
          setQuestionnaire={setQuestionnaire}
        />
      ) : (
        <Match />
      )}
    </ScrollView>
  );
}

const Questionnaire = ({
  questionnaire,
  setQuestionnaire,
}: {
  questionnaire: Questionnaire;
  setQuestionnaire: (questionnaire: Questionnaire) => void;
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
          color: Colors.gray500,
        }}
        dropdownIconStyle={{ top: 20, right: 10 }}
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
      />
      <Text style={styles.label}>Tonight I am hoping to...</Text>
      <TextInput
        style={styles.input}
        placeholder="I am hoping to..."
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
        style={{ ...styles.multilineInput, marginBottom: 40 }}
        placeholder="3D Printing, Cooking, etc."
        value={questionnaire.nonSoftware}
        onChangeText={(text) =>
          setQuestionnaire({ ...questionnaire, nonSoftware: text })
        }
        multiline
      />
    </View>
  );
};

const Match = () => {
  return (
    <View>
      <Text>Match</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
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
  },
  multilineInput: {
    textAlignVertical: "top",
    height: 100,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: Colors.white,
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
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
  },
  selectedItem: {
    fontSize: 16,
  },
});
