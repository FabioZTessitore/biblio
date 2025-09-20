import { Text, View, StyleSheet } from "react-native";
import Signup from "./signup";

export default function Index() {
  return (
    <View style={styles.main}>
      <Text>Biblio app here</Text>
      <Signup />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
