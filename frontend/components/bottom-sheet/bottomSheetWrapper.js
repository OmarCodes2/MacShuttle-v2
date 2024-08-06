import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '../../constants/styles/colors';

const BottomSheetWrapper = ({ children }) => {
  const bottomSheetRef = useRef(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['33%', '75%']}
      backgroundStyle={styles.background}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default BottomSheetWrapper;

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.black,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
});
