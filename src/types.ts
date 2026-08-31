export type TabIndex = 'home' | 'guardian' | 'community' | 'diary' | 'profile';
export type SubView = 'none' | 'support' | 'about' | 'refuge' | 'permissions' | 'about-app';

export interface AppState {
  currentTab: TabIndex;
  currentSubView: SubView;
  isPanicMode: boolean;
}
