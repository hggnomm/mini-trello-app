import { Express } from "express";

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Trello App API",
      version: "1.0.0",
      description: "Backend API documentation for Mini Trello App",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local backend server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error message" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "user_id" },
            email: { type: "string", example: "user@example.com" },
            name: { type: "string", example: "user" },
            role: { type: "string", enum: ["admin", "user"], example: "user" },
            isVerified: { type: "boolean", example: true },
            githubId: { type: "string", example: "123456" },
            githubName: { type: "string", example: "github_username" },
          },
        },
        Board: {
          type: "object",
          properties: {
            id: { type: "string", example: "board_id" },
            name: { type: "string", example: "Board Name" },
            description: { type: "string", example: "Board Description" },
            ownerId: { type: "string", example: "user_id" },
            githubRepository: {
              type: "object",
              properties: {
                id: { type: "string", example: "github_repository_id" },
                fullName: { type: "string", example: "owner/repo" },
                url: { type: "string", example: "https://github.com/owner/repo" },
              },
            },
            listMembers: {
              type: "object",
              additionalProperties: {
                type: "string",
                enum: ["accepted", "pending", "declined"],
              },
              example: {
                member_user_id: "accepted",
              },
            },
          },
        },
        Card: {
          type: "object",
          properties: {
            id: { type: "string", example: "card_id" },
            boardId: { type: "string", example: "board_id" },
            ownerId: { type: "string", example: "user_id" },
            name: { type: "string", example: "Card Name" },
            description: { type: "string", example: "Card Description" },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "task_id" },
            boardId: { type: "string", example: "board_id" },
            cardId: { type: "string", example: "card_id" },
            ownerId: { type: "string", example: "user_id" },
            title: { type: "string", example: "Task Title" },
            description: { type: "string", example: "Task Description" },
            status: { type: "string", example: "Task Status" },
            assignedMembers: {
              type: "array",
              items: { type: "string" },
              example: ["member_user_id"],
            },
            order: { type: "number", example: 1 },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          tags: ["App"],
          summary: "Root check",
          responses: {
            200: {
              description: "Backend is running",
              content: {
                "text/plain": {
                  schema: { type: "string", example: "Hello, World!" },
                },
              },
            },
          },
        },
      },
      "/health": {
        get: {
          tags: ["App"],
          summary: "Health check",
          responses: {
            200: {
              description: "Backend, database, and GitHub connection status",
            },
          },
        },
      },
      "/auth/send-otp": {
        post: {
          tags: ["Auth"],
          summary: "Send OTP to email",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: { type: "string", example: "user@example.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "OTP sent",
              content: {
                "application/json": {
                  example: { message: "OTP code sent to email successfully" },
                },
              },
            },
            400: { description: "Bad request" },
          },
        },
      },
      "/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Verify and create user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "verifyCode"],
                  properties: {
                    email: { type: "string", example: "user@example.com" },
                    verifyCode: { type: "number", example: 123456 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User verified",
              content: {
                "application/json": {
                  example: { id: "user_id", email: "user@example.com" },
                },
              },
            },
            400: { description: "Bad request" },
          },
        },
      },
      "/auth/signin": {
        post: {
          tags: ["Auth"],
          summary: "Sign in with email OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "verifyCode"],
                  properties: {
                    email: { type: "string", example: "user@example.com" },
                    verifyCode: { type: "number", example: 123456 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Signed in",
              content: {
                "application/json": {
                  example: { accessToken: "jwt_access_token" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/auth/github": {
        get: {
          tags: ["Auth"],
          summary: "Start GitHub OAuth sign in",
          description: "Redirects browser to GitHub OAuth authorize page.",
          responses: {
            302: { description: "Redirect to GitHub" },
            400: { description: "Bad request" },
          },
        },
      },
      "/auth/github/callback": {
        get: {
          tags: ["Auth"],
          summary: "GitHub OAuth callback",
          parameters: [
            {
              name: "code",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "GitHub account connected",
              content: {
                "application/json": {
                  example: {
                    user: {
                      id: "user_id",
                      email: "user@example.com",
                      githubId: "123456",
                      githubName: "github_username",
                    },
                  },
                },
              },
            },
            400: { description: "Bad request" },
          },
        },
      },
      "/boards": {
        get: {
          tags: ["Boards"],
          summary: "Get all boards",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Board list",
              content: {
                "application/json": {
                  example: [{ id: "board_id", name: "Board Name", ownerId: "user_id" }],
                },
              },
            },
          },
        },
        post: {
          tags: ["Boards"],
          summary: "Create board",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string", example: "Board Name" },
                    description: { type: "string", example: "Board Description" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Board created" },
            400: { description: "Bad request" },
          },
        },
      },
      "/boards/{id}": {
        get: {
          tags: ["Boards"],
          summary: "Get board by id",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Board details" },
            404: { description: "Board not found" },
          },
        },
        put: {
          tags: ["Boards"],
          summary: "Update board",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { name: "New Board Name", description: "New Description" },
              },
            },
          },
          responses: {
            200: { description: "Board updated" },
            404: { description: "Board not found" },
          },
        },
        delete: {
          tags: ["Boards"],
          summary: "Delete board",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            204: { description: "Board deleted" },
            404: { description: "Board not found" },
          },
        },
      },
      "/boards/{boardId}/invite": {
        post: {
          tags: ["Boards"],
          summary: "Invite user to board",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "boardId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {
                  board_owner_id: "owner_user_id",
                  member_id: "member_user_id",
                  email_member: "member@example.com",
                },
              },
            },
          },
          responses: {
            200: { description: "Invitation sent" },
            400: { description: "Bad request" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/boards/{boardId}/invite/accept": {
        get: {
          tags: ["Boards"],
          summary: "Accept board invitation",
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "memberId", in: "query", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Invitation accepted" },
            400: { description: "Bad request" },
          },
        },
      },
      "/boards/{boardId}/cards": {
        get: {
          tags: ["Cards"],
          summary: "Get all cards in board",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "boardId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Card list" } },
        },
        post: {
          tags: ["Cards"],
          summary: "Create card",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "boardId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { name: "Card Name", description: "Card Description" },
              },
            },
          },
          responses: { 201: { description: "Card created" } },
        },
      },
      "/boards/{boardId}/cards/user/{userId}": {
        get: {
          tags: ["Cards"],
          summary: "Get cards by user",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "userId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "User card list" } },
        },
      },
      "/boards/{boardId}/cards/{id}": {
        get: {
          tags: ["Cards"],
          summary: "Get card by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Card details" } },
        },
        put: {
          tags: ["Cards"],
          summary: "Update card",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { name: "Updated Card Name", description: "Updated Description" },
              },
            },
          },
          responses: { 200: { description: "Card updated" } },
        },
        delete: {
          tags: ["Cards"],
          summary: "Delete card",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 204: { description: "Card deleted" } },
        },
      },
      "/boards/{boardId}/cards/{cardId}/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks in card",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "cardId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Task list" } },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create task",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "boardId", in: "path", required: true, schema: { type: "string" } },
            { name: "cardId", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {
                  title: "Task Title",
                  description: "Task Description",
                  status: "Task Status",
                },
              },
            },
          },
          responses: { 201: { description: "Task created" } },
        },
      },
      "/boards/{boardId}/cards/{cardId}/tasks/{taskId}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by id",
          security: [{ bearerAuth: [] }],
          parameters: taskPathParams(),
          responses: { 200: { description: "Task details" } },
        },
        put: {
          tags: ["Tasks"],
          summary: "Update task",
          security: [{ bearerAuth: [] }],
          parameters: taskPathParams(),
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { title: "Updated Task Title", description: "Updated Description" },
              },
            },
          },
          responses: { 200: { description: "Task updated" } },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete task",
          security: [{ bearerAuth: [] }],
          parameters: taskPathParams(),
          responses: { 204: { description: "Task deleted" } },
        },
      },
      "/boards/{boardId}/cards/{cardId}/tasks/{taskId}/assign": {
        get: {
          tags: ["Task Assignments"],
          summary: "Get all members assigned to task",
          security: [{ bearerAuth: [] }],
          parameters: taskPathParams(),
          responses: { 200: { description: "Assigned member list" } },
        },
        post: {
          tags: ["Task Assignments"],
          summary: "Assign member to task",
          security: [{ bearerAuth: [] }],
          parameters: taskPathParams(),
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { memberId: "member_user_id" },
              },
            },
          },
          responses: { 201: { description: "Member assigned" } },
        },
      },
      "/boards/{boardId}/cards/{cardId}/tasks/{taskId}/assign/{memberId}": {
        delete: {
          tags: ["Task Assignments"],
          summary: "Remove member from task",
          security: [{ bearerAuth: [] }],
          parameters: [
            ...taskPathParams(),
            { name: "memberId", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 204: { description: "Member removed" } },
        },
      },
    },
  },
  apis: [],
};

function taskPathParams() {
  return [
    { name: "boardId", in: "path", required: true, schema: { type: "string" } },
    { name: "cardId", in: "path", required: true, schema: { type: "string" } },
    { name: "taskId", in: "path", required: true, schema: { type: "string" } },
  ];
}

export const swaggerSpec = swaggerJsdoc(options);

export function setupApiDocs(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
