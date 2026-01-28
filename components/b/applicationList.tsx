import React, { useMemo, useState } from "react";
import { View, Pressable, FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { FileX2, ChevronRight } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import NoData from "../../components/shared/noData";
import LeaveModal from "./applicationModal";
import { Leave } from "../../contexts/api/leave";
import {
  LeaveStatus,
  LeaveStatusMeta,
  LeaveItem,
} from "../../hooks/useApplication";

export type LeaveFilter = "ALL" | "APPROVED" | "PENDING" | "CANCELLED";

export type LeaveListItem = {
  id: string;
  primary: string;
  secondary: string;
  meta: string;
  status: LeaveStatus;
  statusMeta: LeaveStatusMeta;
  statusColors: LeaveItem["statusColors"];
  raw: Leave;
};

type LeaveListProps = {
  data: LeaveListItem[];
};

const FILTERS: LeaveFilter[] = ["ALL", "APPROVED", "PENDING", "CANCELLED"];

export default function LeaveList({ data }: LeaveListProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal } = useOverlay();
  const [filter, setFilter] = useState<LeaveFilter>("ALL");

  const filteredData = useMemo(() => {
    if (filter === "ALL") return data;
    return data.filter((i) => i.status === filter);
  }, [data, filter]);

  const filterTone = (f: LeaveFilter) => {
    if (f === "ALL") return { bg: colors.primary, fg: colors.onPrimary };

    const sample = data.find((d) => d.status === f);
    return sample
      ? {
          bg: sample.statusColors.container,
          fg: sample.statusColors.onContainer,
        }
      : {
          bg: colors.surfaceVariant,
          fg: colors.onSurfaceVariant,
        };
  };

  const openDetails = (item: LeaveListItem) => {
    modal({
      dismissible: true,
      content: <LeaveModal item={item} onClose={dismissModal} />,
    });
  };

  const renderItem = ({ item }: { item: LeaveListItem }) => (
    <Pressable
      onPress={() => openDetails(item)}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.md,
        elevation: pressed ? 1 : 4,
        shadowColor: colors.shadow,
        shadowOpacity: pressed ? 0.08 : 0.14,
        shadowRadius: pressed ? 4 : 8,
        shadowOffset: { width: 0, height: pressed ? 1 : 4 },
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.md,
        }}
      >
        {/* LEFT */}
        <View style={{ flex: 1, gap: tokens.spacing.sm }}>
          {/* Status + Duration */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.sm,
            }}
          >
            <View
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: item.statusColors.container,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: item.statusColors.onContainer,
                  fontWeight: "700",
                }}
              >
                {item.statusMeta.label}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: tokens.radii.full,
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: colors.onSurfaceVariant,
                  fontWeight: "600",
                }}
              >
                {item.meta}
              </Text>
            </View>
          </View>

          <Text
            variant="labelLarge"
            style={{ fontWeight: "600", color: colors.onSurface }}
          >
            {item.primary}
          </Text>

          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {item.secondary}
          </Text>
        </View>

        <ChevronRight size={20} color={colors.onSurfaceVariant} />
      </View>
    </Pressable>
  );

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
        {FILTERS.map((f) => {
          const active = f === filter;
          const tone = filterTone(f);

          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.radii.full,
                backgroundColor: active ? tone.bg : colors.surfaceVariant,
              }}
            >
              <Text
                variant="labelMedium"
                style={{
                  color: active ? tone.fg : colors.onSurfaceVariant,
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
        <FlatList
          data={filteredData}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: tokens.spacing.sm }} />
          )}
          scrollEnabled={false}
        />
      ) : (
        <NoData
          icon={<FileX2 size={24} color={colors.onSurfaceVariant} />}
          title="No leave records"
          subtitle="Try adjusting the filter"
        />
      )}
    </View>
  );
}
