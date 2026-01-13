/**
 * Mock for Next.js headers in Storybook
 */

export const headers = () => {
  return new Headers();
};

export const cookies = () => {
  const cookieStore = new Map<string, string>();
  
  return {
    get: (name: string) => {
      const value = cookieStore.get(name);
      return value ? { name, value } : undefined;
    },
    getAll: () => {
      return Array.from(cookieStore.entries()).map(([name, value]) => ({ name, value }));
    },
    has: (name: string) => cookieStore.has(name),
    set: (name: string, value: string) => {
      cookieStore.set(name, value);
    },
    delete: (name: string) => {
      cookieStore.delete(name);
    },
  };
};

export const draftMode = () => {
  return {
    isEnabled: false,
    enable: () => console.log('[Storybook Mock] draftMode.enable'),
    disable: () => console.log('[Storybook Mock] draftMode.disable'),
  };
};

