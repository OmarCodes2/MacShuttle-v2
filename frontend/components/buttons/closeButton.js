import { Ionicons } from "@expo/vector-icons"
import { colors } from "../../constants/styles/colors"

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="circle-with-cross" size={16} style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  icon: {
    color: colors.red,
  },
})

export default CloseButton
