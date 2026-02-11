import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, FlatList, ActivityIndicator } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import { searchClinics, Clinic } from "../../contexts/api/clinic";

type ClinicPickerProps = {
  title: string;
  subtitle?: string;
  onDone?: (clinic?: Clinic) => void;
};

export default function ClinicPicker({
  title,
  subtitle = "Search clinic by name",
  onDone,
}: ClinicPickerProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { alert, dismissModal } = useOverlay();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Clinic | null>(null);

  const performSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchClinics(text.trim());
      setResults(data || []);
    } catch (e) {
      alert({
        title: "Search failed",
        message: "Unable to fetch clinic list.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query, performSearch]);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: tokens.radii["2xl"],
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.xl,
        gap: tokens.spacing.md,
        maxHeight: 520,
      }}
    >
      <View style={{ gap: 4 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700" }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {subtitle}
        </Text>
      </View>

      <TextInput
        mode="outlined"
        label="Search clinic"
        placeholder="Enter clinic name"
        value={query}
        onChangeText={setQuery}
      />

      {loading && (
        <View style={{ paddingVertical: tokens.spacing.md }}>
          <ActivityIndicator />
        </View>
      )}

      {!loading && (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.clinic_id)}
          style={{ maxHeight: 260 }}
          ItemSeparatorComponent={() => (
            <View style={{ height: tokens.spacing.sm }} />
          )}
          renderItem={({ item }) => {
            const isActive = selected?.clinic_id === item.clinic_id;

            return (
              <Pressable
                onPress={() => setSelected(item)}
                style={{
                  padding: tokens.spacing.md,
                  borderRadius: tokens.radii.lg,
                  backgroundColor: isActive
                    ? colors.primaryContainer
                    : colors.surfaceVariant,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    color: isActive
                      ? colors.onPrimaryContainer
                      : colors.onSurface,
                  }}
                >
                  {item.clinic_name}
                </Text>
                <Text
                  variant="labelSmall"
                  style={{
                    color: isActive
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant,
                  }}
                >
                  {item.address}, {item.area}, {item.state}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            query.trim() && !loading ? (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.onSurfaceVariant,
                  marginTop: tokens.spacing.md,
                }}
              >
                No clinics found
              </Text>
            ) : null
          }
        />
      )}

      <Button
        mode="contained"
        disabled={!selected}
        onPress={() => {
          onDone?.(selected || undefined);
          dismissModal();
        }}
      >
        Confirm clinic
      </Button>
    </View>
  );
}
