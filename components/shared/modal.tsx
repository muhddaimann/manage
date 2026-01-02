import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Animated, Easing, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { ModalOptions } from "../../contexts/overlayContext";
import { useDesign } from "../../contexts/designContext";

type Props = {
  visible: boolean;
  state: ModalOptions | null;
  onDismiss: () => void;
};

export default function ModalSheet({ visible, state, onDismiss }: Props) {
  const { tokens } = useDesign();

  const [rendered, setRendered] = useState(false);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible && state) {
      setRendered(true);

      backdropOpacity.setValue(0);
      translateY.setValue(16);
      scale.setValue(0.96);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 220,
          mass: 0.7,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 18,
          stiffness: 200,
          mass: 0.7,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (rendered) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 16,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRendered(false);
      });
    }
  }, [visible, state]);

  if (!rendered || !state) return null;

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 300 }}>
      <Pressable
        style={{ flex: 1 }}
        onPress={state.dismissible === false ? undefined : onDismiss}
      >
        <Animated.View style={{ flex: 1, opacity: backdropOpacity }}>
          <BlurView intensity={48} tint="dark" style={{ flex: 1 }} />
        </Animated.View>
      </Pressable>

      <View
        pointerEvents="box-none"
        style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          justifyContent: "center",
          padding: tokens.spacing.lg,
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY }, { scale }],
            width: "100%",
            maxWidth: 420,
          }}
        >
          {state.content}
        </Animated.View>
      </View>
    </View>
  );
}
