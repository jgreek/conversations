// app/providers.tsx
import { ConversationsProvider } from './contexts/ConversationsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConversationsProvider>
      {children}
    </ConversationsProvider>
  );
}