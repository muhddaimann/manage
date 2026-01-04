import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { FileX2 } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import NoData from "../../components/shared/noData";

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
              style={{
                backgroundColor: colors.surface,
                borderRadius: tokens.radii.lg,
                padding: tokens.spacing.md,
                gap: tokens.spacing.xs,
              }}
            >
              <Text
                variant="labelLarge"
                style={{ fontWeight: "600", color: colors.onSurface }}
              >
                {item.primary}
              </Text>

              {item.secondary && (
                <Text
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {item.secondary}
                </Text>
              )}

              {item.meta && (
                <Text
                  variant="bodySmall"
                  style={{
                    color: colors.onSurfaceVariant,
                    opacity: 0.8,
                  }}
                >
                  {item.meta}
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
