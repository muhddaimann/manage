import React, { useMemo, useState } from "react";
import { View, Pressable, FlatList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { FileX2, ChevronRight } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../contexts/overlayContext";
import { useLeaveStore } from "../../contexts/api/leaveStore";
import { useBalanceStore } from "../../contexts/api/balanceStore";
import { useLoader } from "../../contexts/loaderContext";
import NoData from "../../components/shared/noData";
import LeaveModal from "./applicationModal";
import FullLoading from "../../components/shared/fullLoad";
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
  raw: LeaveItem["raw"];
};

type LeaveListProps = {
  data: LeaveListItem[];
};

const FILTERS: LeaveFilter[] = ["ALL", "APPROVED", "PENDING", "CANCELLED"];

export default function LeaveList({ data }: LeaveListProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { modal, dismissModal, confirm, toast } = useOverlay();
  const { show: showLoader, hide: hideLoader } = useLoader();

  const withdraw = useLeaveStore((s) => s.withdraw);
  const loading = useLeaveStore((s) => s.loading);
  const fetchBalance = useBalanceStore((s) => s.fetchBalance);

  const [filter, setFilter] = useState<LeaveFilter>("ALL");

  const filteredData = useMemo(() => {
    if (filter === "ALL") return data;
    return data.filter((i) => i.status === filter);
  }, [data, filter]);

  const openDetails = (item: LeaveListItem) => {
    modal({
      dismissible: true,
      content: (
        <LeaveModal
          item={item}
          onClose={dismissModal}
          onWithdraw={async (leaveId) => {
            dismissModal();

            const ok = await confirm({
              title: "Withdraw leave?",
              message: "This action cannot be undone.",
              variant: "error",
            });

            if (!ok) return;

            showLoader("Withdrawing leave…");

            try {
              const result = await withdraw(leaveId);

              if (result.success) {
                await fetchBalance();
                toast({
                  message: "Leave withdrawn successfully",
                  variant: "success",
                });
              } else {
                toast({
                  message: result.error || "Failed to withdraw leave",
                  variant: "error",
                });
              }
            } finally {
              hideLoader();
            }
          }}
        />
      ),
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
        <View style={{ flex: 1, gap: tokens.spacing.sm }}>
          <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
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
                style={{ color: colors.onSurfaceVariant, fontWeight: "600" }}
              >
                {item.meta}
              </Text>
            </View>
          </View>

          <Text variant="labelLarge" style={{ fontWeight: "600" }}>
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

  if (loading) {
    return <FullLoading />;
  }

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={{
              paddingHorizontal: tokens.spacing.md,
              paddingVertical: tokens.spacing.sm,
              borderRadius: tokens.radii.full,
              backgroundColor:
                f === filter ? colors.primary : colors.surfaceVariant,
            }}
          >
            <Text
              variant="labelMedium"
              style={{
                color:
                  f === filter ? colors.onPrimary : colors.onSurfaceVariant,
                fontWeight: f === filter ? "700" : "500",
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {filteredData.length ? (
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
