import React from "react";
import { TextStyle } from "react-native";
import { useTheme, Text as PaperText, type TextProps as PaperTextProps } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type Weight = "reg" | "med" | "semibold" | "bold";
type Align = "auto" | "left" | "right" | "center" | "justify";

type BaseProps = Omit<PaperTextProps<never>, "style"> & {
  color?: string;
  weight?: Weight;
  align?: Align;
  muted?: boolean;
  style?: TextStyle | TextStyle[];
};

const fontFamilies = {
  reg: "Inter_400Regular",
  med: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

function BaseText({
  children,
  color,
  weight = "reg",
  align = "left",
  muted = false,
  style,
  ...rest
}: BaseProps & { size: number }) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const fontFamily = fontFamilies[weight];
  const opacity = muted
    ? tokens.typography.opacities.muted
    : tokens.typography.opacities.normal;

  return (
    <PaperText
      style={[
        {
          color: color ?? colors.onBackground,
          opacity,
          fontFamily,
          fontSize: rest.size,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </PaperText>
  );
}

export function H1(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes["3xl"]} weight="bold" {...props} />;
}

export function H2(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes["2xl"]} weight="bold" {...props} />;
}

export function H3(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes.xl} weight="bold" {...props} />;
}

export function Subtitle(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes.lg} weight="semibold" {...props} />;
}

export function Body(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes.md} weight="reg" {...props} />;
}

export function BodySmall(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes.sm} weight="reg" {...props} />;
}

export function Caption(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes.xs} muted {...props} />;
}

export function Overline(props: BaseProps) {
  const { tokens } = useDesign();
  return <BaseText size={tokens.typography.sizes.xs} weight="med" muted {...props} />;
}
