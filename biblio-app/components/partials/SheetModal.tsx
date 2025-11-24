import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useColorScheme } from '~/lib/useColorScheme';
import { convertToRGBA } from '~/lib/utils';

interface SheetModalProps {
  visible: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  snapPoints?: string[];
  children?: React.ReactNode;
}

const SheetModal = ({ visible, onClose, onOpen, snapPoints, children }: SheetModalProps) => {
  const { colors } = useColorScheme();

  const ref = useRef<BottomSheetModal>(null);

  // Snap points interni
  const snapPointInternal = useMemo(() => snapPoints ?? ['25%', '50%', '75%', '100%'], []);

  // Callback interna per gestire apertura/chiusura
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose]
  );

  // Gestione apertura in base a "visible"
  useEffect(() => {
    if (visible) {
      ref.current?.present();
      onOpen?.();
    } else {
      ref.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPointInternal}
      enableBlurKeyboardOnGesture
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      onChange={handleSheetChanges}
      handleIndicatorStyle={{
        backgroundColor: colors.foreground,
        height: 2,
        width: 40,
      }}
      containerStyle={{
        backgroundColor: convertToRGBA(colors.background, 0.6),
      }}
      backgroundStyle={{ backgroundColor: colors.card }}>
      {children}
    </BottomSheetModal>
  );
};

export { SheetModal };
