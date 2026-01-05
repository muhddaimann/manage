import { useRef, useState } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";
import { useTabs } from "../contexts/tabContext";

type UseGestureOptions = {
  hideNavOffset?: number;
  scrollTopOffset?: number;
  threshold?: number;
  controlNav?: boolean;
};

export function useGesture({
  hideNavOffset = 100,
  scrollTopOffset = 300,
  threshold = 8,
  controlNav = true,
}: UseGestureOptions = {}) {
  const { setHideTabBar } = useTabs();

  const scrollRef = useRef<ScrollView>(null);
  const lastY = useRef(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const onScroll = (e: NativeScrollEvent) => {
    const y = e.contentOffset.y;
    const diff = y - lastY.current;

    setShowScrollTop(y > scrollTopOffset);

    if (controlNav) {
      if (diff > threshold && y > hideNavOffset) {
        setHideTabBar(true);
      }

      if (diff < -threshold) {
        setHideTabBar(false);
      }
    }

    lastY.current = y;
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return {
    scrollRef,
    onScroll,
    scrollToTop,
    showScrollTop,
  };
}
