import React from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { Text, useTheme } from "react-native-paper";
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
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: tokens.radii.xl,
              paddingVertical: tokens.spacing.lg,
              paddingHorizontal: tokens.spacing.xl,
              alignItems: "center",
              gap: tokens.spacing.sm,
              minWidth: 160,
              shadowColor: colors.shadow,
              shadowOpacity: 0.2,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 16,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />

            {message && (
              <Text
                variant="bodyMedium"
                style={{
                  fontWeight: "600",
                  color: colors.onSurface,
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
