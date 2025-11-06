import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useThemeToggle } from "../../../contexts/themeContext";
import { useDesign } from "../../../contexts/designContext";
import {
  useToast,
  useAlert,
  useConfirm,
  useModal,
} from "../../../hooks/useOverlay";
import { Button } from "../../../components/atom/button";
import {
  Check,
  Info,
  AlertTriangle,
  X,
  Sun,
  Moon,
  PlusCircle,
  Trash2,
} from "lucide-react-native";
import { H2 } from "../../../components/atom/text";

function ModalContent() {
  const { dismissModal } = useModal();
  const { tokens } = useDesign();
  const { colors } = useTheme();
  return (
    <View style={{ padding: tokens.spacing.lg, gap: tokens.spacing.md }}>
      <Text style={{ color: colors.onSurface, fontSize: 16 }}>
        This is the content of the modal.
      </Text>
      <Button onPress={dismissModal} mode="contained" rounded="sm">
        Close Modal
      </Button>
    </View>
  );
}

export default function Molecule() {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();
  const { toggle } = useThemeToggle();
  const toast = useToast();
  const { alert } = useAlert();
  const confirm = useConfirm();
  const { modal } = useModal();

  const Row = ({ children }: { children: React.ReactNode }) => (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", gap: tokens.spacing.xs }}
    >
      {children}
    </View>
  );

  const Label = ({
    children,
    color,
  }: {
    children: React.ReactNode;
    color: string;
  }) => (
    <Text
      style={{
        color,
        fontFamily: "Inter_500Medium",
        fontWeight: "500",
        fontSize: 16,
      }}
    >
      {children as any}
    </Text>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: tokens.spacing.lg,
        gap: tokens.spacing.lg,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <H2>Alerts, Confirms, Modals</H2>

      <Row>
        <Button
          mode="contained"
          IconLeft={Info}
          onPress={() => alert({ title: "Heads up", message: "Simple alert." })}
        >
          Alert (Primary)
        </Button>

        <Button
          mode="contained-tonal"
          IconLeft={PlusCircle}
          onPress={() =>
            confirm({
              title: "Confirm",
              message: "Proceed with this action?",
            }).then((ok) =>
              toast({
                message: ok ? "Confirmed" : "Cancelled",
                variant: ok ? "success" : "warning",
              })
            )
          }
        >
          Confirm (Tonal)
        </Button>

        <Button
          mode="contained"
          IconLeft={Trash2}
          onPress={() =>
            confirm({
              title: "Delete item?",
              message: "This action is irreversible.",
              variant: "error",
            }).then((ok) =>
              toast({
                message: ok ? "Deleted" : "Safe",
                variant: ok ? "error" : "info",
              })
            )
          }
          style={{ backgroundColor: colors.error }}
        >
          <Label color={colors.onError}>Destructive Confirm</Label>
        </Button>

        <Button
          mode="elevated"
          IconLeft={Check}
          onPress={() => modal({ content: <ModalContent /> })}
        >
          <Label color={colors.primary}>Open Modal (Elevated)</Label>
        </Button>
      </Row>

      <H2>Toasts</H2>
      <Row>
        <Button
          mode="contained"
          IconLeft={Info}
          onPress={() => toast({ message: "Info toast", variant: "info" })}
          style={{ backgroundColor: colors.primary }}
        >
          <Label color={colors.onPrimary}>Info</Label>
        </Button>

        <Button
          mode="contained"
          IconLeft={Check}
          onPress={() =>
            toast({ message: "Success toast", variant: "success" })
          }
          style={{ backgroundColor: colors.tertiary }}
        >
          <Label color={colors.onTertiary}>Success</Label>
        </Button>

        <Button
          mode="contained"
          IconLeft={AlertTriangle}
          onPress={() =>
            toast({ message: "Warning toast", variant: "warning" })
          }
          style={{ backgroundColor: colors.secondary }}
        >
          <Label color={colors.onSecondary}>Warning</Label>
        </Button>

        <Button
          mode="contained"
          IconLeft={X}
          onPress={() => toast({ message: "Error toast", variant: "error" })}
          style={{ backgroundColor: colors.error }}
        >
          <Label color={colors.onError}>Error</Label>
        </Button>

        <Button
          mode="contained-tonal"
          onPress={() =>
            toast({
              message: "With action",
              variant: "info",
              actionLabel: "Undo",
              onAction: () => toast({ message: "Undone", variant: "success" }),
              duration: 4000,
            })
          }
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <Label color={colors.onPrimaryContainer}>Toast w/ Action</Label>
        </Button>
      </Row>

      <H2>Theme Toggle & Other Buttons</H2>
      <Row>
        <Button
          mode="outlined"
          onPress={toggle}
          IconLeft={dark ? Sun : Moon}
          rounded="pill"
          dense
        >
          <Label color={colors.primary}>
            {dark ? "Light Mode" : "Dark Mode"}
          </Label>
        </Button>

        <Button
          mode="text"
          onPress={() =>
            alert({
              title: "Tip",
              message: "Use text button for inline actions.",
            })
          }
          dense
        >
          <Label color={colors.primary}>Text Action</Label>
        </Button>

        <Button
          mode="outlined"
          rounded="sm"
          dense
          onPress={() =>
            confirm({ title: "Secondary?", message: "Styled outline sample." })
          }
          style={{ borderColor: colors.secondary }}
        >
          <Label color={colors.secondary}>Outline Secondary</Label>
        </Button>

        <Button
          mode="outlined"
          rounded="sm"
          dense
          onPress={() =>
            confirm({ title: "Tertiary?", message: "Styled outline sample." })
          }
          style={{ borderColor: colors.tertiary }}
        >
          <Label color={colors.tertiary}>Outline Tertiary</Label>
        </Button>

        <Button
          mode="outlined"
          rounded="sm"
          dense
          onPress={() =>
            confirm({ title: "Danger?", message: "Styled outline sample." })
          }
          style={{ borderColor: colors.error }}
        >
          <Label color={colors.error}>Outline Error</Label>
        </Button>
      </Row>

      <H2>Full-Width Button</H2>
      <Row>
        <Button
          mode="contained"
          rounded="pill"
          fullWidth
          onPress={() =>
            toast({ message: "Full-width CTA", variant: "success" })
          }
          style={{ backgroundColor: colors.primary }}
        >
          <Label color={colors.onPrimary}>Full-Width Primary CTA</Label>
        </Button>
      </Row>
    </ScrollView>
  );
}
