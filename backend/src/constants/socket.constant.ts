export const SOCKET_EVENTS = {
  BOARD_JOIN: "board:join",
  BOARD_LEAVE: "board:leave",
  CARD_CREATED: "card:created",
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",
  MEMBER_ASSIGNED: "member:assigned",
  MEMBER_REMOVED: "member:removed",
} as const;
