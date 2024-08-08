import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/styles/colors';

const BottomSheetBlock = ({ leftText, rightText, clickable = false, onPress }) => {
  const renderIcon = clickable ? (
    <Ionicons name='chevron-forward' size={16} style={styles.icon} />
  ) : null;

  const content = (
    <View style={styles.innerContainer}>
      <Text style={styles.leftText}>{leftText}</Text>
      <Text style={styles.rightText}>{rightText}</Text>
      {renderIcon}
    </View>
  );

  if (clickable) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        {content}
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }
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
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftText: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    // fontFamily: 'Montserrat-Regular',
  },
  rightText: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    textAlign: 'right',
    // fontFamily: 'Montserrat-Regular',
  },
  icon: {
    marginLeft: 8,
    color: colors.white,
  },
});

export default BottomSheetBlock;
