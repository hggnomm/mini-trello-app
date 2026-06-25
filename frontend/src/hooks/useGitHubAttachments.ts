import { useCallback, useEffect, useState } from "react";
import type { GitHubAttachment, GitHubAttachmentType } from "@/api/githubAttachment";
import { attachGithubItem, getGithubAttachments, removeGithubAttachment } from "@/api/githubAttachment";

type UseGitHubAttachmentsArgs = {
  taskId: string;
};

export function useGitHubAttachments({ taskId }: UseGitHubAttachmentsArgs) {
  const [attachments, setAttachments] = useState<GitHubAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGithubAttachments(taskId);
      setAttachments(data);
    } catch {
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  const attach = useCallback(
    async (type: GitHubAttachmentType, payload: { number?: number; sha?: string; title: string; url: string }) => {
      setSaving(true);
      try {
        await attachGithubItem(taskId, { type, ...payload });
        await load();
      } finally {
        setSaving(false);
      }
    },
    [taskId, load],
  );

  const remove = useCallback(
    async (attachmentId: string) => {
      setSaving(true);
      try {
        await removeGithubAttachment(taskId, attachmentId);
        await load();
      } finally {
        setSaving(false);
      }
    },
    [taskId, load],
  );

  return { attachments, loading, saving, attach, remove };
}
