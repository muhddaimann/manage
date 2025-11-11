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
import { useAuth } from "../../../contexts/authContext";
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
  LogOut,
  PencilLine,
} from "lucide-react-native";
import { H2 } from "../../../components/atom/text";
import { Fab } from "../../../components/molecule/fab";

function ModalContent() {
  const { dismissModal } = useModal();
  const { tokens } = useDesign();
  const { colors } = useTheme();
  return (
    <View style={{ padding: tokens.spacing.lg }}>
      <Text style={{ color: colors.onSurface, fontSize: 16 }}>
        This is the content of the modal.
      </Text>
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
  const { signOut } = useAuth();

  const Row = ({ children }: { children: React.ReactNode }) => (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", gap: tokens.spacing.xs }}
    >
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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
            variant="default"
            IconLeft={Info}
            onPress={() =>
              alert({ title: "Heads up", message: "Simple alert." })
            }
          >
            Alert (Default)
          </Button>

          <Button
            variant="secondary"
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
            Confirm (Secondary)
          </Button>

          <Button
            variant="destructive"
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
          >
            Destructive Confirm
          </Button>

          <Button
            variant="outline"
            IconLeft={Check}
            onPress={() => modal({ content: <ModalContent /> })}
          >
            Open Modal (Outline)
          </Button>
        </Row>

        <H2>Toasts</H2>
        <Row>
          <Button
            variant="default"
            IconLeft={Info}
            onPress={() => toast({ message: "Info toast", variant: "info" })}
          >
            Info
          </Button>

          <Button
            variant="secondary"
            IconLeft={Check}
            onPress={() =>
              toast({ message: "Success toast", variant: "success" })
            }
          >
            Success
          </Button>

          <Button
            variant="outline"
            IconLeft={AlertTriangle}
            onPress={() =>
              toast({ message: "Warning toast", variant: "warning" })
            }
          >
            Warning
          </Button>

          <Button
            variant="destructive"
            IconLeft={X}
            onPress={() => toast({ message: "Error toast", variant: "error" })}
          >
            Error
          </Button>

          <Button
            variant="ghost"
            onPress={() =>
              toast({
                message: "With action",
                variant: "info",
                actionLabel: "Undo",
                onAction: () =>
                  toast({ message: "Undone", variant: "success" }),
                duration: 4000,
              })
            }
          >
            Toast w/ Action
          </Button>
        </Row>

        <H2>Theme & Variants</H2>
        <Row>
          <Button
            variant="secondary"
            onPress={toggle}
            IconLeft={dark ? Sun : Moon}
            fullWidth
            size="md"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </Button>
        </Row>
      </ScrollView>

      <Fab
        icon={LogOut}
        label="Sign out"
        variant="primary"
        corner="br"
        onPress={signOut}
      />

      <Fab
        icon={PlusCircle}
        label="New"
        variant="secondary"
        size="lg"
        corner="center-bottom"
        offset={tokens.spacing.xl}
        onPress={() =>
          toast({ message: "Create something new", variant: "info" })
        }
      />

      <Fab
        icon={Trash2}
        variant="destructive"
        corner="bl"
        onPress={() =>
          confirm({
            title: "Delete?",
            message: "Permanently remove item?",
            variant: "error",
          }).then((ok) =>
            toast({
              message: ok ? "Deleted" : "Cancelled",
              variant: ok ? "error" : "warning",
            })
          )
        }
      />

      <Fab
        icon={PencilLine}
        variant="surface"
        corner="tr"
        onPress={() => modal({ content: <ModalContent /> })}
      />
    </View>
  );
}
