import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

export function useActor() {
  const result = useCoreActor(createActor);
  return result;
}
