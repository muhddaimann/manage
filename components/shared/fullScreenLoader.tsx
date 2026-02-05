import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { BlurView } from "expo-blur";
import { useDesign } from "../../contexts/designContext";

type Props = {
  visible: boolean;
  message?: string;
};

export default function FullScreenLoader({ visible, message }: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: tokens.spacing.sm,
          }}
        >
          <ActivityIndicator size="large" color={colors.surface} />

          {message && (
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "600",
                color: colors.surface,
                textAlign: "center",
              }}
            >
              {message}
            </Text>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}
