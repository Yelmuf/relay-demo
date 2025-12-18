import { createContext, useContextSelector } from "use-context-selector";

export const SyncContext = createContext({
  id: null as string | null,
  navigateToId: (id: string) => {},
});

export const useIdFromSyncContext = () =>
  useContextSelector(SyncContext, (ctx) => ctx.id);

export const useNavigateToIdFromSyncContext = () =>
  useContextSelector(SyncContext, (ctx) => ctx.navigateToId);
