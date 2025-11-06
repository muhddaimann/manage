import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Divider, Text } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import {
  H1,
  H2,
  H3,
  Subtitle,
  Body,
  BodySmall,
  Caption,
  Overline,
} from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";

export default function Atom() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: tokens.spacing.md, gap: tokens.spacing.xs }}>
        <H1 color={colors.primary}>Heading 1</H1>
        <H2 color={colors.secondary}>Heading 2</H2>
        <H3 color={colors.tertiary}>Heading 3</H3>
        <Subtitle color={colors.error}>Subtitle</Subtitle>
        <Body color={colors.primary}>Body text</Body>
        <BodySmall color={colors.secondary}>Small body text</BodySmall>
        <Caption color={colors.tertiary}>Caption text</Caption>
        <Overline color={colors.error}>Overline text</Overline>

        <Divider style={{ marginVertical: tokens.spacing.md }} />

        <View style={{ gap: tokens.spacing.xs }}>
          <Text
            style={{
              color: colors.primary,
              fontSize: tokens.typography.sizes["3xl"],
              fontWeight: tokens.typography.weights.bold,
            }}
          >
            Heading 1 (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.secondary,
              fontSize: tokens.typography.sizes["2xl"],
              fontWeight: tokens.typography.weights.bold,
            }}
          >
            Heading 2 (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.tertiary,
              fontSize: tokens.typography.sizes.xl,
              fontWeight: tokens.typography.weights.bold,
            }}
          >
            Heading 3 (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.error,
              fontSize: tokens.typography.sizes.lg,
              fontWeight: tokens.typography.weights.semibold,
            }}
          >
            Subtitle (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.primary,
              fontSize: tokens.typography.sizes.md,
              fontWeight: tokens.typography.weights.reg,
            }}
          >
            Body text (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.secondary,
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.reg,
            }}
          >
            Small body text (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.tertiary,
              fontSize: tokens.typography.sizes.xs,
              fontWeight: tokens.typography.weights.reg,
              opacity: tokens.typography.opacities.muted,
            }}
          >
            Caption text (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.error,
              fontSize: tokens.typography.sizes.xs,
              fontWeight: tokens.typography.weights.med,
              opacity: tokens.typography.opacities.muted,
            }}
          >
            Overline text (Paper Text)
          </Text>
        </View>

        <Divider style={{ marginVertical: tokens.spacing.md }} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: tokens.spacing.lg }}>
          <View style={{ gap: tokens.spacing.md }}>
            <H3>Primary Tone</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button size="small" onPress={() => {}}>Contained</Button>
              <Button size="medium" onPress={() => {}}>Contained</Button>
              <Button size="large" onPress={() => {}}>Contained</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button mode="contained-tonal" size="small" onPress={() => {}}>Contained Tonal</Button>
              <Button mode="contained-tonal" size="medium" onPress={() => {}}>Contained Tonal</Button>
              <Button mode="contained-tonal" size="large" onPress={() => {}}>Contained Tonal</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button mode="outlined" size="small" onPress={() => {}}>Outlined</Button>
              <Button mode="outlined" size="medium" onPress={() => {}}>Outlined</Button>
              <Button mode="outlined" size="large" onPress={() => {}}>Outlined</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button mode="elevated" size="small" onPress={() => {}}>Elevated</Button>
              <Button mode="elevated" size="medium" onPress={() => {}}>Elevated</Button>
              <Button mode="elevated" size="large" onPress={() => {}}>Elevated</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button mode="text" size="small" onPress={() => {}}>Text</Button>
              <Button mode="text" size="medium" onPress={() => {}}>Text</Button>
              <Button mode="text" size="large" onPress={() => {}}>Text</Button>
            </View>
          </View>
          <View style={{ gap: tokens.spacing.md }}>
            <H3>Error Tone</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button tone="error" size="small" onPress={() => {}}>Contained</Button>
              <Button tone="error" size="medium" onPress={() => {}}>Contained</Button>
              <Button tone="error" size="large" onPress={() => {}}>Contained</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button tone="error" mode="contained-tonal" size="small" onPress={() => {}}>Contained Tonal</Button>
              <Button tone="error" mode="contained-tonal" size="medium" onPress={() => {}}>Contained Tonal</Button>
              <Button tone="error" mode="contained-tonal" size="large" onPress={() => {}}>Contained Tonal</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button tone="error" mode="outlined" size="small" onPress={() => {}}>Outlined</Button>
              <Button tone="error" mode="outlined" size="medium" onPress={() => {}}>Outlined</Button>
              <Button tone="error" mode="outlined" size="large" onPress={() => {}}>Outlined</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button tone="error" mode="elevated" size="small" onPress={() => {}}>Elevated</Button>
              <Button tone="error" mode="elevated" size="medium" onPress={() => {}}>Elevated</Button>
              <Button tone="error" mode="elevated" size="large" onPress={() => {}}>Elevated</Button>
            </View>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm, alignItems: "center" }}>
              <Button tone="error" mode="text" size="small" onPress={() => {}}>Text</Button>
              <Button tone="error" mode="text" size="medium" onPress={() => {}}>Text</Button>
              <Button tone="error" mode="text" size="large" onPress={() => {}}>Text</Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}
