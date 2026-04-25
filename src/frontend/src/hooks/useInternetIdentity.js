// Re-export useInternetIdentity and related utilities from the core-infrastructure package.
// All components should import from this file, not directly from the package.
export {
  useInternetIdentity,
  InternetIdentityProvider,
} from "@caffeineai/core-infrastructure";
