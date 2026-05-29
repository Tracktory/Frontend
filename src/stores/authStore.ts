import AsyncStorage from '@react-native-async-storage/async-storage';
import type { create as CreateType } from 'zustand';
import type {
  createJSONStorage as CreateJSONStorageType,
  persist as PersistType,
} from 'zustand/middleware';

import type { SignUpResponseData } from '../api/authApi';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as {
  create: typeof CreateType;
};
const { createJSONStorage, persist } = require('zustand/middleware') as {
  createJSONStorage: typeof CreateJSONStorageType;
  persist: typeof PersistType;
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  expiresIn: number | null;
  setAuth: (data: SignUpResponseData) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      expiresIn: null,
      setAuth: (data: SignUpResponseData) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.userId,
          expiresIn: data.expiresIn,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          expiresIn: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
