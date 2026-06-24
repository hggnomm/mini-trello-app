export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  GITHUB_CALLBACK: "/auth/github/callback",
  BOARD_DETAIL: "/b/:boardId/",
  BOARD_INVITE_ACCEPT: "/b/:boardId/invite/accept",
} as const;
