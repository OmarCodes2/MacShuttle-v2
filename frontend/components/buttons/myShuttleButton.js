import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { colors } from "../../constants/styles/colors"

const MyShuttleButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>My Current Shuttle</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.green,
    position: "absolute",
    top: 48,
    alignSelf: "center",
  },
  icon: {
    color: colors.white,
  },
  text: {
    color: colors.white,
    // fontFamily: 'Montserrat-Regular',
    textTransform: "uppercase",
  },
})

export default MyShuttleButton
