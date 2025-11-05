import { Text } from "react-native-paper";

export type TextVariant = React.ComponentProps<typeof Text>["variant"];

export type TextSection = {
  title: string;
  items: Array<{ variant: TextVariant; sample: string }>;
};

export function useTextDemo(): TextSection[] {
  return [
    {
      title: "Headline",
      items: [
        { variant: "headlineLarge",  sample: "headlineLarge — The quick brown fox jumps over the lazy dog." },
        { variant: "headlineMedium", sample: "headlineMedium — The quick brown fox jumps over the lazy dog." },
        { variant: "headlineSmall",  sample: "headlineSmall — The quick brown fox jumps over the lazy dog." },
      ],
    },
    {
      title: "Title",
      items: [
        { variant: "titleLarge",  sample: "titleLarge — The quick brown fox jumps over the lazy dog." },
        { variant: "titleMedium", sample: "titleMedium — The quick brown fox jumps over the lazy dog." },
        { variant: "titleSmall",  sample: "titleSmall — The quick brown fox jumps over the lazy dog." },
      ],
    },
    {
      title: "Body",
      items: [
        { variant: "bodyLarge",  sample: "bodyLarge — The quick brown fox jumps over the lazy dog." },
        { variant: "bodyMedium", sample: "bodyMedium — The quick brown fox jumps over the lazy dog." },
        { variant: "bodySmall",  sample: "bodySmall — The quick brown fox jumps over the lazy dog." },
      ],
    },
    {
      title: "Label",
      items: [
        { variant: "labelLarge",  sample: "labelLarge — The quick brown fox jumps over the lazy dog." },
        { variant: "labelMedium", sample: "labelMedium — The quick brown fox jumps over the lazy dog." },
        { variant: "labelSmall",  sample: "labelSmall — The quick brown fox jumps over the lazy dog." },
      ],
    },
  ];
}
