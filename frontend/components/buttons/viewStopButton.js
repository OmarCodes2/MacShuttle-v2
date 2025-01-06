import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { colors } from "../../constants/styles/colors"

const ViewStopButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.yellow }]}
      onPress={onPress}
    >
      <Text style={styles.text}>View Stop</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    // fontFamily: 'Montserrat-Regular',
    textTransform: "uppercase",
  },
})

export default ViewStopButton
