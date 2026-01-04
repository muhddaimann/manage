import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { ChevronDown } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";

export type SectionItem<T extends string> = {
  key: T;
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
};

type SectionSwitcherProps<T extends string> = {
  value: T;
  items: SectionItem<T>[];
  onChange: (value: T) => void;
  title?: string;
};

export default function SectionSwitcher<T extends string>({
  value,
  items,
  onChange,
  title = "You’re viewing",
}: SectionSwitcherProps<T>) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal } = useOverlay();

  const activeItem = items.find((i) => i.key === value)!;
  const ActiveIcon = activeItem.icon;

  const openModal = () => {
    modal({
      content: (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii.xl,
            padding: tokens.spacing.md,
            gap: tokens.spacing.sm,
          }}
        >
          <Text
            variant="titleSmall"
            style={{ color: colors.onSurface }}
          >
            Switch section
          </Text>

          {items.map(({ key, label, hint, icon: Icon }, idx) => {
            const active = key === value;

            return (
              <React.Fragment key={key}>
                <Pressable
                  onPress={() => {
                    onChange(key);
                    dismissModal();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: tokens.spacing.sm,
                    paddingVertical: tokens.spacing.sm,
                    paddingHorizontal: tokens.spacing.xs,
                    borderRadius: tokens.radii.md,
                    backgroundColor: active
                      ? colors.primaryContainer
                      : "transparent",
                  }}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      color={
                        active
                          ? colors.onPrimaryContainer
                          : colors.onSurfaceVariant
                      }
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text
                      variant="labelMedium"
                      style={{
                        color: active
                          ? colors.onPrimaryContainer
                          : colors.onSurface,
                        fontWeight: active ? "600" : "400",
                      }}
                    >
                      {label}
                    </Text>

                    {hint && (
                      <Text
                        variant="bodySmall"
                        style={{ color: colors.onSurfaceVariant }}
                      >
                        {hint}
                      </Text>
                    )}
                  </View>
                </Pressable>

                {idx < items.length - 1}
              </React.Fragment>
            );
          })}
        </View>
      ),
    });
  };

  return (
    <View>
      <Text
        variant="labelLarge"
        style={{
          color: colors.onSurfaceVariant,
          marginBottom: tokens.spacing.xs,
          paddingHorizontal: tokens.spacing.xs,
        }}
      >
        {title}
      </Text>

      <Pressable
        onPress={openModal}
        style={({ pressed }) => ({
          padding: tokens.spacing.md,
          borderRadius: tokens.radii.xl,
          backgroundColor: colors.surface,
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.sm,
          elevation: pressed
            ? tokens.elevation.level1
            : tokens.elevation.level3,
          shadowColor: colors.shadow,
          shadowOpacity: pressed ? 0.08 : 0.1,
          shadowRadius: pressed ? 2 : 4,
          shadowOffset: { width: 0, height: pressed ? 2 : 4 },
          transform: [{ scale: pressed ? 0.99 : 1 }],
        })}
      >
        {ActiveIcon && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: tokens.radii.full,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
            }}
          >
            <ActiveIcon size={20} color={colors.onPrimary} />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text
            variant="titleSmall"
            style={{ color: colors.onSurface, fontWeight: "600" }}
          >
            {activeItem.label}
          </Text>

          {activeItem.hint && (
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {activeItem.hint}
            </Text>
          )}
        </View>

        <ChevronDown size={18} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}
