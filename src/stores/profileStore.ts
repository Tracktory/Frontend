import type { create as CreateType } from 'zustand';
import type { StackNavigationProp } from '@react-navigation/stack';

import { fetchProfile, patchProfile as patchProfileApi } from '../api/profileApi';
import type { PatchProfileRequestBody, ProfileData } from '../api/profileApi';
import { AuthApiError } from '../api/authApi';
import { useAuthStore } from './authStore';
import { useOnboardingStore } from './onboardingStore';
import type { RootStackParamList } from '../navigation/RootNavigator';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as { create: typeof CreateType };

type RootNavigation = StackNavigationProp<RootStackParamList>;

interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  isError: boolean;
  loadProfile: (accessToken: string, navigation: RootNavigation) => Promise<void>;
  patchProfile: (
    accessToken: string,
    body: PatchProfileRequestBody,
    navigation: RootNavigation
  ) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  isLoading: false,
  isError: false,

  loadProfile: async (accessToken, navigation) => {
    set({ isLoading: true, isError: false });
    try {
      const data = await fetchProfile(accessToken);
      set({ profile: data, isLoading: false, isError: false });
      useOnboardingStore.getState().hydrateFromProfile(data);
      if (data.profile.name) {
        useAuthStore.getState().setUserName(data.profile.name);
      }
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            set({ isLoading: false });
            navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          case 'RESOURCE_NOT_FOUND':
            set({ isLoading: false });
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
            break;
          default:
            set({ isLoading: false, isError: true });
        }
      } else {
        set({ isLoading: false, isError: true });
      }
    }
  },

  patchProfile: async (accessToken, body, navigation) => {
    await patchProfileApi(accessToken, body);
    const data = await fetchProfile(accessToken);
    set({ profile: data, isError: false });
    useOnboardingStore.getState().hydrateFromProfile(data);
    if (data.profile.name) {
      useAuthStore.getState().setUserName(data.profile.name);
    }
  },

  clearProfile: () => set({ profile: null, isLoading: false, isError: false }),
}));
