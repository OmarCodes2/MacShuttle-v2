import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/styles/colors';

const BottomSheetBlock = ({
  leftText,
  rightText,
  clickable = false,
  onClick,
}) => {
  const renderIcon = clickable ? (
    <Ionicons name='chevron-forward' size={16} style={styles.icon} />
  ) : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={clickable ? onClick : undefined}
    >
      <Text style={styles.leftText}>{leftText}</Text>
      <Text style={styles.rightText}>{rightText}</Text>
      {renderIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
    backgroundColor: colors.blackLight,
    borderRadius: 8,
  },
  leftText: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Montserrat-Regular',
  },
  rightText: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    textAlign: 'right',
    fontFamily: 'Montserrat-Regular',
  },
  icon: {
    marginLeft: 8,
    color: colors.white,
  },
});

export default BottomSheetBlock;
