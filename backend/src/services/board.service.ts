import { BoardRepository } from "../repositories/board.repository";
import { Board } from "../models/board.model";
import { sendMail } from "../libs/nodemailer/nodemailer";
import { UserRepository } from "../repositories/user.repository";
import { isEmail } from "../utils/email";
import { logger } from "../utils/logger";

export interface InviteMemberIntoBoardInput {
  boardId: string;
  board_owner_id: string;
  member_id: string;
  email_member?: string;
}

export interface IBoardService {
  createBoard(
    name: string,
    ownerId: string,
    description?: string,
  ): Promise<Board>;
  getAllBoards(): Promise<Board[]>;
  getAllBoardsCustom(userId: string): Promise<Board[]>;
  getBoardById(id: string): Promise<Board | null>;
  updateBoardById(id: string, data: Partial<Board>): Promise<Board>;
  deleteBoard(id: string): Promise<Board | null>;
  inviteUserToBoard(input: InviteMemberIntoBoardInput): Promise<void>;
  acceptBoardInvitation(boardId: string, memberId: string): Promise<void>;
}

export class BoardService implements IBoardService {
  private boardRepository = new BoardRepository();
  private userRepository = new UserRepository();

  async createBoard(
    name: string,
    ownerId: string,
    description?: string,
  ): Promise<Board> {
    if (!name) {
      throw new Error("Board Name cannot be null");
    }
    if (!ownerId) {
      throw new Error("Owner Id cannot be null");
    }

    const dataBoard = {
      name: name,
      description: description || "",
      ownerId: ownerId,
      listMembers: {},
    };

    return await this.boardRepository.create(dataBoard);
  }

  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.findAll();
  }

  async getAllBoardsCustom(userId: string): Promise<Board[]> {
    return await this.boardRepository.getAllBoardsCustom(userId);
  }

  async getBoardById(id: string): Promise<Board | null> {
    return await this.boardRepository.findById(id);
  }

  async updateBoardById(id: string, data: Partial<Board>): Promise<Board> {
    return await this.boardRepository.update(id, data);
  }

  async deleteBoard(id: string): Promise<Board | null> {
    return await this.boardRepository.delete(id);
  }

  async inviteUserToBoard(input: InviteMemberIntoBoardInput): Promise<void> {
    const { boardId, board_owner_id, member_id, email_member } = input;

    const boardOwnerId = board_owner_id;
    const memberId = member_id;
    const emailMember = email_member;

    if (!boardId) throw new Error("Board Id cannot be null");
    if (!boardOwnerId) throw new Error("Board Owner Id cannot be null");
    if (!memberId) throw new Error("Member Id cannot be null");

    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error("Board not found");

    if (emailMember && !isEmail(emailMember)) {
      throw new Error("Email format not true");
    }

    // invite member
    let email = emailMember;

    // check user
    const user = await this.userRepository.findById(memberId);

    if (!user) throw new Error("User not found");
    if (!user.email) throw new Error("Email not found at user");
    if (!user.isVerified) throw new Error("User is not exits in the system");

    if (emailMember && user.email !== emailMember) {
      throw new Error(
        "Provided email does not match member's registered email",
      );
    }

    email = user.email;

    if (memberId === boardOwnerId) {
      throw new Error("You cannot invite yourself to the board");
    }

    const listMembers = board.listMembers || {};
    const currentStatus = listMembers[memberId];

    if (currentStatus === "accepted") {
      throw new Error("User is already a member of this board");
    }

    // set member in board list members, set pending status when invited us first
    listMembers[memberId] = "pending";

    await this.boardRepository.update(boardId, { listMembers });

    // current, set redirect callback link on backend, future to change on frontend
    const acceptLink = `http://localhost:8000/boards/${boardId}/invite/accept?memberId=${memberId}`;

    const { subject, htmlMessage } = this.buildBoardInvitationEmail(
      board.name,
      acceptLink,
    );

    await sendMail(email, subject, htmlMessage);

    logger.info(`Invited member ${email}`);
  }

  async acceptBoardInvitation(
    boardId: string,
    memberId: string,
  ): Promise<void> {
    if (!boardId) throw new Error("Board Id cannot be null");
    if (!memberId) throw new Error("Member Id cannot be null");

    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error("Board not found");

    const listMembers = board.listMembers || {};

    if (listMembers[memberId] !== "pending") {
      throw new Error("User not pending status");
    }

    listMembers[memberId] = "accepted";

    await this.boardRepository.update(boardId, { listMembers });
  }

  private buildBoardInvitationEmail(
    boardName: string,
    acceptLink: string,
  ): {
    subject: string;
    htmlMessage: string;
  } {
    return {
      subject: `Invitation to join board: ${boardName}`,
      htmlMessage: `
        <h3>Board Invitation</h3>
        <p>You have been invited to join <strong>${boardName}</strong>.</p>
        <p>
          <a href="${acceptLink}">Accept Invitation</a>
        </p>
        <p>If you were not expecting this invitation, please ignore this email.</p>
      `,
    };
  }
}
