import { useMemo } from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { colors } from "../../constants/styles/colors"
import { BOARDED } from "../../constants/shuttles/statuses"

const BoardShuttleButton = ({ status, onPress }) => {
  const buttonColor = useMemo(
    () => (status === BOARDED ? colors.red : colors.green),
    [status]
  )

  const buttonText = useMemo(
    () => (status === BOARDED ? "Disembark" : "Board"),
    [status]
  )

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    // fontFamily: 'Montserrat-Regular',
    textTransform: "uppercase",
  },
})

export default BoardShuttleButton
