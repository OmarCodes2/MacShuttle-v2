import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet } from "react-native"
import { colors } from "../../constants/styles/colors"

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="close-circle" size={48} style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 48,
    right: 16,
  },
  icon: {
    color: colors.red,
  },
})

export default CloseButton
