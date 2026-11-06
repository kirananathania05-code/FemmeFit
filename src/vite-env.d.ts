/// <reference types="vite/client" />

// Allow importing .js modules from .vue/.ts files
declare module '*.js';

// Fix vuex type resolution with package.json exports
declare module 'vuex' {
  export function createStore<S>(options: any): any;
  export function useStore<S = any>(): any;
}
