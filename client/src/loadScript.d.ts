declare module 'vue/types/vue' {
  interface VueConstructor {
    loadScript: (url: string) => void;
  }
}
