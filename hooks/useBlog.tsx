export type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  cover: string;
};

const featured: Post = {
  id: "p0",
  title: "Designing with React Native Paper: A Practical Guide",
  excerpt:
    "Learn how to build beautiful, accessible, and theme-aware mobile screens with React Native Paper and Expo Router.",
  author: "Aiman Othman",
  date: "Nov 5, 2025",
  tags: ["react-native", "design-system", "paper"],
  cover:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
};

const posts: Post[] = [
  {
    id: "p1",
    title: "Tokens First: Spacing, Radii, and Motion",
    excerpt:
      "Why design tokens help teams ship consistent UI faster—and how to wire them into your app architecture.",
    author: "Team MAMO",
    date: "Nov 1, 2025",
    tags: ["tokens", "ux", "architecture"],
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200",
  },
  {
    id: "p2",
    title: "Expo Router Patterns for Real Apps",
    excerpt:
      "Tabs, stacks, safe areas, and theme injection—clean patterns you can reuse across projects.",
    author: "Daythree DX",
    date: "Oct 28, 2025",
    tags: ["expo-router", "navigation"],
    cover:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
  },
  {
    id: "p3",
    title: "Ship Faster with Skeletons & Loadable UI",
    excerpt:
      "Perceived performance matters. Skeletons, spinners, and progressive hydration strategies.",
    author: "Laive Lab",
    date: "Oct 20, 2025",
    tags: ["performance", "skeleton"],
    cover:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200",
  },
];

export function useBlog() {
  return { featured, posts };
}
