import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import { Check } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";

export type OptionItem<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
};

type OptionPickerProps<T extends string = string> = {
  title: string;
  subtitle?: string;
  icon?: string;
  options: OptionItem<T>[];
  initialValue?: T;
  onSelect: (value: T) => void;
};

export default function OptionPicker<T extends string = string>({
  title,
  subtitle = "Tap an option to select",
  icon = "format-list-bulleted",
  options,
  initialValue,
  onSelect,
}: OptionPickerProps<T>) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        paddingVertical: tokens.spacing.md,
        paddingHorizontal: tokens.spacing.lg,
        gap: tokens.spacing.sm,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 2 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700" }}>
            {title}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        </View>

        <IconButton
          icon={icon}
          size={26}
          iconColor={colors.primary}
          style={{ margin: 0 }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{ maxHeight: 280 }}
        contentContainerStyle={{
          gap: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
        }}
      >
        {options.map((opt) => {
          const active = opt.value === initialValue;

          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.lg,
                backgroundColor: active
                  ? colors.primaryContainer
                  : colors.surfaceVariant,
              }}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  variant="bodyMedium"
                  style={{
                    fontWeight: active ? "700" : "500",
                    color: active
                      ? colors.onPrimaryContainer
                      : colors.onSurface,
                  }}
                >
                  {opt.label}
                </Text>

                {opt.description && (
                  <Text
                    variant="bodySmall"
                    style={{
                      color: active
                        ? colors.onPrimaryContainer
                        : colors.onSurfaceVariant,
                    }}
                  >
                    {opt.description}
                  </Text>
                )}
              </View>

              {active && <Check size={20} color={colors.onPrimaryContainer} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
