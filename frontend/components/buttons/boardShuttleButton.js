import { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/styles/colors';

const boardShuttleButton = ({ status, onPress }) => {
  const buttonColor = useMemo(
    () => (status === 'board' ? colors.green : colors.red),
    [status]
  );

  const buttonText = useMemo(
    () => (status === 'board' ? 'Board' : 'Disembark'),
    [status]
  );

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontFamily: 'Montserrat-Regular',
    textTransform: 'uppercase',
  },
});

export default boardShuttleButton;
