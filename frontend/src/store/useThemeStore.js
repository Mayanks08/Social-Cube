import { create } from 'zustand'

 export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("cube-theme") ||"forest",
  setTheme:(theme)=>{
    localStorage.setItem("cube-theme",theme)
    set({theme})
  }
}))
