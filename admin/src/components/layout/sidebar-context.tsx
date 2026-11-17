import { createContext, useContext } from 'react'

interface SidebarState {
  open: boolean
  setOpen: (open: boolean) => void
}

/** 极简侧边栏状态：只用来在窄屏下把导航变成浮层，避免撑窄内容区 */
export const SidebarContext = createContext<SidebarState>({ open: false, setOpen: () => {} })

export const useSidebar = () => useContext(SidebarContext)
