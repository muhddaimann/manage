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
              color: colors.onBackground,
              fontSize: tokens.typography.sizes.md,
            }}
          >
            Body text (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.sm,
            }}
          >
            Small body text (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.xs,
              opacity: tokens.typography.opacities.muted,
            }}
          >
            Caption text (Paper Text)
          </Text>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.xs,
              opacity: tokens.typography.opacities.muted,
              fontWeight: tokens.typography.weights.med as any,
            }}
          >
            Overline text (Paper Text)
          </Text>
        </View>

        <Divider style={{ marginVertical: tokens.spacing.md }} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: tokens.spacing.xl,
            paddingBottom: tokens.spacing.md,
          }}
        >
          <View style={{ gap: tokens.spacing.md }}>
            <H3>Default</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <Button variant="default" size="sm">
                Small
              </Button>
              <Button variant="default" size="md">
                Medium
              </Button>
              <Button variant="default" size="lg">
                Large
              </Button>
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <H3>Secondary</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary" size="md">
                Medium
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <H3>Destructive</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <Button variant="destructive" size="sm">
                Small
              </Button>
              <Button variant="destructive" size="md">
                Medium
              </Button>
              <Button variant="destructive" size="lg">
                Large
              </Button>
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <H3>Outline</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="outline" size="md">
                Medium
              </Button>
              <Button variant="outline" size="lg">
                Large
              </Button>
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <H3>Ghost & Link</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <Button variant="ghost" size="md">
                Ghost
              </Button>
              <Button variant="link" size="md">
                Learn more
              </Button>
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <H3>States</H3>
            <View style={{ flexDirection: "row", gap: tokens.spacing.sm }}>
              <Button variant="default" size="md" loading>
                Loading
              </Button>
              <Button variant="secondary" size="md" disabled>
                Disabled
              </Button>
            </View>
          </View>
        </ScrollView>

        <View style={{ gap: tokens.spacing.sm }}>
          <H3>Full width</H3>
          <Button variant="default" fullWidth rounded="sm">
            Primary action
          </Button>
          <Button variant="secondary" fullWidth rounded="pill">
            Secondary action
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
