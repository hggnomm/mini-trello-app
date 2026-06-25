import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SiGithub } from "react-icons/si";

import BaseModal from "@/base/baseModal";
import BaseButton from "@/base/baseButton";
import CloseButton from "@/base/baseButton/CloseButton";
import BaseSpinner from "@/base/baseSpinner";

import { getUserRepositories, type GitHubUserRepository } from "@/api/github";
import { updateBoard, type Board, type GitHubRepository } from "@/api/board";
import { getLinkUrl } from "@/api/auth";

type GitHubRepoPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  board: Board;
  onLinked?: (repo: GitHubRepository | undefined) => void;
  isOwner?: boolean;
};

export default function GitHubRepoPickerModal({
  isOpen,
  onClose,
  board,
  onLinked,
  isOwner = false,
}: GitHubRepoPickerModalProps) {
  const [repos, setRepos] = useState<GitHubUserRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState<number | null>(null);

  const getAllRepositories = async () => {
    setLoading(true);
    try {
      const data = await getUserRepositories();
      setRepos(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    getAllRepositories();
  }, [isOpen]);

  const handleConnectGithub = async () => {
    try {
      const { url } = await getLinkUrl();
      window.location.href = url;
    } catch {
      toast.error("Failed to start GitHub linking");
    }
  };

  const handleLink = async (repo: GitHubUserRepository) => {
    setLinking(repo.id);
    try {
      const payload: GitHubRepository = {
        id: repo.id,
        fullName: repo.fullName,
        url: repo.htmlUrl,
      };
      const result = await updateBoard(board.id, { githubRepository: payload });
      toast.success(`Linked ${repo.fullName}`);
      onLinked?.(result.updatedBoard.githubRepository ?? payload);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to link repository");
    } finally {
      setLinking(null);
    }
  };

  const handleUnlink = async () => {
    setLinking(-1);
    try {
      await updateBoard(board.id, { githubRepository: null });
      toast.success("Repository unlinked");
      onLinked?.(undefined);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unlink repository");
    } finally {
      setLinking(null);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="!max-w-[520px]">
      <CloseButton onClick={onClose} />

      <div className="flex items-center gap-3 mb-4">
        <SiGithub size={26} />
        <div>
          <h3 className="text-lg font-bold text-white">GitHub repositories</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Link a repository to <span className="text-gray-200 font-semibold">{board.name}</span>
          </p>
        </div>
      </div>

      {board?.githubRepository && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-200 truncate">{board.githubRepository.fullName}</p>
            <a
              href={board.githubRepository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 mt-0.5 inline-block truncate"
            >
              {board.githubRepository.url}
            </a>
          </div>
          {isOwner && (
            <BaseButton
              variant="ghost"
              className="!text-xs !text-red-400 hover:!bg-red-500/10"
              loading={linking === -1}
              onClick={handleUnlink}
            >
              Unlink
            </BaseButton>
          )}
        </div>
      )}

      {!board?.githubRepository && (
        <div className="min-h-[200px] max-h-[320px] overflow-y-auto rounded-lg border border-white/10">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <BaseSpinner className="!size-7" />
            </div>
          ) : repos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
              <p className="text-sm text-gray-400">No repositories found.</p>
              <BaseButton variant="primary" onClick={handleConnectGithub}>
                Connect GitHub account
              </BaseButton>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {repos.map((repo) => {
                const isLinked = board.githubRepository?.id === repo.id;
                return (
                  <li key={repo.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.04]">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-200 truncate">{repo.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{repo.htmlUrl}</p>
                    </div>
                    <BaseButton
                      variant={isLinked ? "secondary" : "primary"}
                      className="!text-xs"
                      loading={linking === repo.id}
                      disabled={isLinked || !isOwner}
                      onClick={() => handleLink(repo)}
                    >
                      {isLinked ? "Linked" : isOwner ? "Link" : "View only"}
                    </BaseButton>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {isOwner && (
        <p className="mt-3 text-[11px] text-gray-500">Only the board owner can link or change the repository.</p>
      )}
    </BaseModal>
  );
}
