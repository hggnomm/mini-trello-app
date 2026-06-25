import { useCallback, useEffect, useState } from "react";
import type { GitHubAttachmentType, GitHubCommit, GitHubIssue, GitHubPullRequest } from "@/api/github";
import { getRepoGitHubInfo } from "@/api/github";

type RepoInfo = {
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  commits: GitHubCommit[];
};

type PickerTab = GitHubAttachmentType;

type UseGitHubPickerArgs = {
  boardId: string;
  repositoryId: string | null;
};

export function useGitHubPicker({ boardId, repositoryId }: UseGitHubPickerArgs) {
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<PickerTab>("issue");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!repositoryId) {
      setRepoInfo(null);
      return;
    }

    setLoading(true);
    setError(null);
    getRepoGitHubInfo(boardId, repositoryId)
      .then((info) =>
        setRepoInfo({ pullRequests: info.pullRequests, issues: info.issues, commits: info.commits }),
      )
      .catch(() => setError("Failed to load GitHub data"))
      .finally(() => setLoading(false));
  }, [boardId, repositoryId]);

  const list = useCallback((): (GitHubPullRequest | GitHubIssue | GitHubCommit)[] => {
    if (!repoInfo) return [];
    if (tab === "issue") return repoInfo.issues;
    if (tab === "pull_request") return repoInfo.pullRequests;
    return repoInfo.commits;
  }, [tab, repoInfo]);

  const openPicker = useCallback(() => setOpen(true), []);
  const closePicker = useCallback(() => setOpen(false), []);
  const togglePicker = useCallback(() => setOpen((prev) => !prev), []);

  return { repoInfo, loading, error, tab, setTab, open, openPicker, closePicker, togglePicker, list };
}
