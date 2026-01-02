import React, { useEffect, useRef } from "react";
import { View, Pressable, Animated } from "react-native";
import {
  Home,
  ClipboardList,
  Settings,
  Plus,
  LogOut,
  CalendarPlus,
  Clock,
  DoorOpen,
  UserCheck,
} from "lucide-react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useAuth } from "../../contexts/authContext";
import { useOverlay } from "../../contexts/overlayContext";
import { useTabs } from "../../contexts/tabContext";
import { design } from "../../constants/design";

const TAB_META: Record<
  "a" | "b" | "c",
  { label: string; icon: React.ReactNode }
> = {
  a: { label: "Home", icon: <Home /> },
  b: { label: "Application", icon: <ClipboardList /> },
  c: { label: "Settings", icon: <Settings /> },
};

function NavButton({
  active,
  onPress,
  icon,
  label,
  color,
  activeBg,
}: {
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
  activeBg: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        marginVertical: 6,
        borderRadius: design.radii.full,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? activeBg : "transparent",
        paddingVertical: 6,
        transform: [{ scale: active ? 1.05 : 1 }],
      }}
    >
      {React.cloneElement(icon as any, {
        color,
        size: active ? 24 : 22,
        strokeWidth: active ? 2.5 : 2,
      })}
      <Text
        variant={active ? "labelLarge" : "labelMedium"}
        style={{ marginTop: 2, color }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ActionItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 10,
      }}
    >
      {icon}
      <Text variant="bodyLarge">{label}</Text>
    </Pressable>
  );
}

export default function FloatingTabBar({ state, navigation }: any) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { signOut } = useAuth();
  const { modal, dismissModal } = useOverlay();
  const { hideTabBar } = useTabs();

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: hideTabBar ? 120 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: hideTabBar ? 0 : 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hideTabBar]);

  const activeIndex = state.index;
  const activeRoute = state.routes[activeIndex].name as "a" | "b" | "c";

  const onTabPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented && activeIndex !== index) {
      navigation.navigate(route.name);
    }
  };

  const openActions = () => {
    if (activeRoute === "c") {
      signOut();
      return;
    }

    modal({
      content: (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii.xl,
            padding: tokens.spacing.xl,
            gap: tokens.spacing.lg,
          }}
        >
          {activeRoute === "a" && (
            <>
              <ActionItem
                label="Apply Leave"
                icon={<CalendarPlus size={20} color={colors.primary} />}
                onPress={dismissModal}
              />
              <ActionItem
                label="Apply Room"
                icon={<DoorOpen size={20} color={colors.primary} />}
                onPress={dismissModal}
              />
              <ActionItem
                label="Add Attendance"
                icon={<UserCheck size={20} color={colors.primary} />}
                onPress={dismissModal}
              />
            </>
          )}

          {activeRoute === "b" && (
            <>
              <ActionItem
                label="Apply Leave"
                icon={<CalendarPlus size={20} color={colors.primary} />}
                onPress={dismissModal}
              />
              <ActionItem
                label="Apply Overtime"
                icon={<Clock size={20} color={colors.primary} />}
                onPress={dismissModal}
              />
            </>
          )}
        </View>
      ),
    });
  };

  const danger = activeRoute === "c";

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: tokens.spacing.md,
        right: tokens.spacing.md,
        bottom: tokens.spacing["3xl"],
        flexDirection: "row",
        alignItems: "center",
        gap: tokens.spacing.md,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 68,
          borderRadius: tokens.radii.full,
          backgroundColor: colors.surface,
          flexDirection: "row",
          paddingHorizontal: tokens.spacing.sm,
          elevation: 18,
          shadowColor: colors.shadow,
          shadowOpacity: 0.2,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 14 },
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const focused = index === activeIndex;
          const meta = TAB_META[route.name as "a" | "b" | "c"];

          return (
            <NavButton
              key={route.key}
              active={focused}
              label={meta.label}
              onPress={() => onTabPress(route, index)}
              icon={meta.icon}
              color={focused ? colors.primary : colors.onSurfaceVariant}
              activeBg={colors.primaryContainer}
            />
          );
        })}
      </View>

      <Pressable
        onPress={openActions}
        style={{
          width: 68,
          height: 68,
          borderRadius: design.radii.full,
          backgroundColor: danger ? colors.error : colors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 20,
          transform: [{ scale: danger ? 1 : 1.08 }],
        }}
      >
        {danger ? (
          <LogOut size={24} color={colors.onError} />
        ) : (
          <Plus size={28} color={colors.onPrimary} />
        )}
      </Pressable>
    </Animated.View>
  );
}
