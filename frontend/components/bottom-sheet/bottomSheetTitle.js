import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/styles/colors';

const BottomSheetTitle = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default BottomSheetTitle;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    // fontFamily: 'Montserrat-Medium',
  },
  subtitle: {
    fontSize: 12,
    color: colors.white,
    // fontFamily: 'Montserrat-Regular',
  },
});
