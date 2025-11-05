import React from "react";
import { View, Image, ScrollView } from "react-native";
import { useTheme, Card, Chip, Button, Divider } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useBlog } from "../../../hooks/useBlog";
import {
  H1,
  H2,
  Subtitle,
  Body,
  BodySmall,
  Caption,
  Overline,
} from "../../../components/atom/text";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { featured, posts } = useBlog();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: tokens.spacing.lg,
          gap: tokens.spacing.lg,
        }}
      >
        <View style={{ gap: tokens.spacing.xs }}>
          <Overline muted>BLOG</Overline>
          <H1 color={colors.primary}>Latest stories & guides</H1>
          <Subtitle color={colors.onSurfaceVariant}>
            Practical tips for React Native, Paper, and design systems.
          </Subtitle>
        </View>

        <Card
          mode="elevated"
          style={{ borderRadius: tokens.radii.lg, overflow: "hidden" }}
        >
          <Image
            source={{ uri: featured.cover }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
          <Card.Content
            style={{
              gap: tokens.spacing.md,
              paddingVertical: tokens.spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: tokens.spacing.xs,
                flexWrap: "wrap",
              }}
            >
              {featured.tags.map((t) => (
                <Chip key={t} compact>
                  {t}
                </Chip>
              ))}
            </View>
            <H2>{featured.title}</H2>
            <Body color={colors.onSurfaceVariant}>{featured.excerpt}</Body>
            <View
              style={{
                flexDirection: "row",
                gap: tokens.spacing.xs,
                alignItems: "center",
              }}
            >
              <Body weight="semibold">{featured.author}</Body>
              <BodySmall color={colors.onSurfaceVariant}>
                • {featured.date}
              </BodySmall>
            </View>
            <Button mode="contained" onPress={() => {}}>
              Read featured
            </Button>
          </Card.Content>
        </Card>

        <Divider style={{ backgroundColor: colors.outlineVariant }} />

        <View style={{ gap: tokens.spacing.md }}>
          {posts.map((p) => (
            <Card
              key={p.id}
              mode="outlined"
              style={{ borderRadius: tokens.radii.lg, overflow: "hidden" }}
            >
              <Card.Content
                style={{
                  gap: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: tokens.spacing.xs,
                    flexWrap: "wrap",
                  }}
                >
                  {p.tags.map((t) => (
                    <Chip key={t} compact>
                      {t}
                    </Chip>
                  ))}
                </View>
                <H2>{p.title}</H2>
                <Body color={colors.onSurfaceVariant}>{p.excerpt}</Body>
                <View
                  style={{
                    marginTop: tokens.spacing.xs,
                    flexDirection: "row",
                    gap: tokens.spacing.xs,
                    alignItems: "center",
                  }}
                >
                  <Body weight="semibold">{p.author}</Body>
                  <BodySmall color={colors.onSurfaceVariant}>
                    • {p.date}
                  </BodySmall>
                </View>
                <Button mode="text" onPress={() => {}}>
                  Read more
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
