import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { FileX2 } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import NoData from "../../components/shared/noData";
import ApplicationModal from "./applicationModal";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApplicationFilter = "ALL" | "APPROVED" | "PENDING" | "CANCELLED";

export type ApplicationListItem = {
  id: string;
  primary: string;
  secondary?: string;
  meta?: string;
  status: ApplicationStatus;
};

type ApplicationListProps = {
  data: ApplicationListItem[];
  mode: "LEAVE" | "OVERTIME";
};

const FILTERS: ApplicationFilter[] = [
  "ALL",
  "APPROVED",
  "PENDING",
  "CANCELLED",
];

export default function ApplicationList({ data, mode }: ApplicationListProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal } = useOverlay();
  const [filter, setFilter] = useState<ApplicationFilter>("ALL");

  const activeBg = mode === "LEAVE" ? colors.secondary : colors.primary;
  const activeText = mode === "LEAVE" ? colors.onSecondary : colors.onPrimary;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filter === "ALL") return true;
      if (filter === "CANCELLED") return item.status === "REJECTED";
      return item.status === filter;
    });
  }, [data, filter]);

  const openDetails = (item: ApplicationListItem) => {
    modal({
      dismissible: true,
      content: (
        <Pressable onPress={dismissModal}>
          <ApplicationModal item={item} mode={mode} onClose={dismissModal} />
        </Pressable>
      ),
    });
  };

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
        {FILTERS.map((f) => {
          const active = f === filter;

          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={({ pressed }) => ({
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.full,
                backgroundColor: active ? activeBg : colors.surfaceVariant,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                variant="labelMedium"
                style={{
                  color: active ? activeText : colors.onSurfaceVariant,
                  fontWeight: active ? "700" : "500",
                }}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredData.length > 0 ? (
        <View style={{ gap: tokens.spacing.sm }}>
          {filteredData.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => openDetails(item)}
              style={({ pressed }) => ({
                backgroundColor: colors.surface,
                borderRadius: tokens.radii.xl,
                padding: tokens.spacing.md,
                gap: tokens.spacing.xs,
                elevation: pressed ? 2 : 6,
                shadowColor: colors.shadow,
                shadowOpacity: pressed ? 0.12 : 0.18,
                shadowRadius: pressed ? 6 : 10,
                shadowOffset: { width: 0, height: pressed ? 2 : 6 },
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: tokens.spacing.sm,
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{ fontWeight: "600", color: colors.onSurface }}
                >
                  {item.primary}
                </Text>

                {item.meta && (
                  <View
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: 4,
                      borderRadius: tokens.radii.full,
                      backgroundColor:
                        mode === "LEAVE"
                          ? colors.secondaryContainer
                          : colors.primaryContainer,
                    }}
                  >
                    <Text
                      variant="labelSmall"
                      style={{
                        color:
                          mode === "LEAVE"
                            ? colors.onSecondaryContainer
                            : colors.onPrimaryContainer,
                        fontWeight: "600",
                      }}
                    >
                      {item.meta}
                    </Text>
                  </View>
                )}
              </View>

              {item.secondary && (
                <Text
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.secondary}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ) : (
        <NoData
          icon={<FileX2 size={24} color={colors.onSurfaceVariant} />}
          title="No records found"
          subtitle="Try adjusting the filter"
        />
      )}
    </View>
  );
}
