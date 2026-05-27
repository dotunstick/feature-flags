import type { Flag } from "./types";

export const SEED_FLAGS: Flag[] = [
  {
    key: "new-dashboard",
    enabled: true,
    rules: [
      { if: { plan: "enterprise", region: "us-east" }, then: "variant_b" },
      { if: { plan: "pro" }, then: "variant_a" },
      { default: "control" },
    ],
  },
  {
    key: "dark-mode",
    enabled: true,
    rules: [
      { if: { beta_user: "true" }, then: "enabled" },
      { default: "disabled" },
    ],
  },
  {
    key: "checkout-v2",
    enabled: false,
    rules: [
      { if: { country: "UK", plan: "pro" }, then: "v2" },
      { if: { country: "US" }, then: "v2_us" },
      { default: "v1" },
    ],
  },
  {
    key: "maintenance-mode",
    enabled: false,
    rules: [{ default: "off" }],
  },
  {
    key: "ai-suggestions",
    enabled: true,
    rules: [
      { if: { plan: "enterprise" }, then: "full" },
      { if: { plan: "pro" }, then: "limited" },
      { default: "hidden" },
    ],
  },
];
