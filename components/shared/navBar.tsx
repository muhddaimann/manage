import React, { useEffect, useRef } from "react";
import { View, Pressable, Animated } from "react-native";
import {
  Home,
  ClipboardList,
  Settings,
  Plus,
  LogOut,
  CalendarPlus,
  DoorOpen,
} from "lucide-react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useAuth } from "../../contexts/authContext";
import { useOverlay } from "../../contexts/overlayContext";
import { useTabs } from "../../contexts/tabContext";
import { router } from "expo-router";

const TAB_META: Record<
  "a" | "b" | "c",
  { label: string; icon: React.ReactNode }
> = {
  a: { label: "Home", icon: <Home /> },
  b: { label: "Application", icon: <ClipboardList /> },
  c: { label: "Settings", icon: <Settings /> },
};

export default function FloatingTabBar({ state, navigation }: any) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { signOut } = useAuth();
  const { modal, dismissModal } = useOverlay();
  const { hideTabBar, setHideTabBar } = useTabs();
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: hideTabBar ? 96 : 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: hideTabBar ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hideTabBar]);

  useEffect(() => {
    setHideTabBar(false);
  }, [state.index]);

  const activeIndex = state.index;
  const activeRoute = state.routes[activeIndex].name as "a" | "b" | "c";

  const onTabPress = (route: any, index: number) => {
    const isFocused = state.index === index;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    } else if (isFocused && !event.defaultPrevented) {
      // If tapping the currently active tab, navigate to its root to "pop to top"
      router.push(route.name);
    }
  };

  const openActions = () => {
  if (activeRoute === "c") {
    signOut();
    return;
  }

  if (activeRoute === "b") {
    router.push("/b/leave");
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
              onPress={() => {
                dismissModal();
                // Explicitly navigate to the 'b' tab first, then push to b/leave within it
                // This ensures the 'b' tab is active and its stack is correctly managed.
                navigation.navigate('b');
                router.push("/b/leave");
              }}
            />

            <ActionItem
              label="Check Room Availability"
              icon={<DoorOpen size={20} color={colors.primary} />}
              onPress={() => {
                dismissModal();
                router.push("/a/room");
              }}
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
          height: 64,
          borderRadius: tokens.radii.full,
          backgroundColor: colors.surface,
          flexDirection: "row",
          elevation: 14,
          shadowColor: colors.shadow,
          shadowOpacity: 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
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
              icon={meta.icon}
              color={focused ? colors.primary : colors.onSurfaceVariant}
              onPress={() => onTabPress(route, index)}
            />
          );
        })}
      </View>

      <Pressable
        onPress={openActions}
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: danger ? colors.error : colors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 18,
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

function NavButton({
  active,
  icon,
  label,
  color,
  onPress,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: active ? "flex-start" : "center",
        paddingVertical: 8,
      }}
    >
      {React.cloneElement(icon as any, {
        size: 22,
        color,
        strokeWidth: active ? 2.4 : 2,
      })}

      <Text
        variant="labelSmall"
        style={{
          marginTop: active ? 4 : 2,
          color,
          fontWeight: active ? "600" : "500",
          opacity: active ? 1 : 0.7,
        }}
      >
        {label}
      </Text>

      {active && (
        <View
          style={{
            marginTop: 4,
            width: 20,
            height: 3,
            borderRadius: 2,
            backgroundColor: color,
          }}
        />
      )}
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
