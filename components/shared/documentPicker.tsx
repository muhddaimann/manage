import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import {
  Text,
  IconButton,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import { Image, Camera, FileText, X } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { useUpload } from "../../hooks/useUpload";
import { useOverlay } from "../../contexts/overlayContext";

type DocumentPickerProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  onDone?: (payload?: {
    uri: string;
    name: string;
    type: string;
    referenceNo: string;
  }) => void;
};

export default function DocumentPicker({
  title,
  subtitle = "Choose a file to attach",
  icon = "paperclip",
  onDone,
}: DocumentPickerProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { alert, dismissModal } = useOverlay();

  const {
    attachedDocument,
    setAttachedDocument,
    tooLarge,
    setTooLarge,
    pickFromCamera,
    pickFromGallery,
    pickFromFiles,
  } = useUpload();

  const [referenceNo, setReferenceNo] = useState("");
  const hasAttachment = !!attachedDocument;

  useEffect(() => {
    if (!tooLarge) return;

    dismissModal();

    requestAnimationFrame(() => {
      alert({
        title: "Attachment too large",
        message: "Maximum allowed file size is 5MB.",
        variant: "error",
      });
    });

    setTooLarge(false);
  }, [tooLarge]);

  const reset = () => {
    setAttachedDocument(null);
    setReferenceNo("");
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.xl,
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
          {!hasAttachment && (
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <IconButton
          icon={icon}
          size={26}
          iconColor={colors.primary}
          style={{ margin: 0 }}
        />
      </View>

      {!hasAttachment && (
        <View style={{ gap: tokens.spacing.sm }}>
          <Pressable
            onPress={pickFromCamera}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <Camera size={20} color={colors.onSurface} />
            <Text>Take photo</Text>
          </Pressable>

          <Pressable
            onPress={pickFromGallery}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <Image size={20} color={colors.onSurface} />
            <Text>Choose from gallery</Text>
          </Pressable>

          <Pressable
            onPress={pickFromFiles}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.md,
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <FileText size={20} color={colors.onSurface} />
            <Text>Browse files (PDF / Image)</Text>
          </Pressable>
        </View>
      )}

      {hasAttachment && (
        <View style={{ gap: tokens.spacing.sm }}>
          <View
            style={{
              padding: tokens.spacing.md,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.primaryContainer,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{ fontWeight: "600", color: colors.onPrimaryContainer }}
              >
                {attachedDocument.name}
              </Text>
              <Text
                variant="labelSmall"
                style={{ color: colors.onPrimaryContainer }}
              >
                Attachment added
              </Text>
            </View>

            <Pressable onPress={reset}>
              <X size={18} color={colors.onPrimaryContainer} />
            </Pressable>
          </View>

          <TextInput
            mode="outlined"
            label="Attachment reference number"
            placeholder="Enter reference number"
            value={referenceNo}
            onChangeText={setReferenceNo}
          />

          <Button
            mode="contained"
            disabled={!referenceNo.trim()}
            onPress={() => {
              onDone?.({
                ...attachedDocument,
                referenceNo: referenceNo.trim(),
              });
            }}
          >
            Confirm attachment
          </Button>
        </View>
      )}
    </View>
  );
}
