import {
  HiOutlineExternalLink,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { SiGithub } from "react-icons/si";
import type { GitHubRepository } from "@/api/board";
import type { GitHubCommit, GitHubIssue, GitHubPullRequest } from "@/api/github";
import type { GitHubAttachmentType } from "@/api/githubAttachment";
import { cn } from "@/utils/cn";
import { useGitHubAttachments } from "@/hooks/useGitHubAttachments";
import { useGitHubPicker } from "@/hooks/useGitHubPicker";

type Props = {
  repo: GitHubRepository | undefined | null;
  boardId: string;
  cardId: string;
  taskId: string;
  onLinkRequest?: () => void;
};

// ── Attachment list ─────────────────────────────────────────────────────────

type AttachListProps = {
  items: ReturnType<typeof useGitHubAttachments>["attachments"];
  loading: boolean;
  saving: boolean;
  onRemove: (id: string) => void;
};

function AttachList({ items, loading, saving, onRemove }: AttachListProps) {
  if (loading) return <p className="text-xs text-gray-400 py-2">Loading...</p>;
  if (items.length === 0) return <p className="text-xs text-gray-500 py-2">No attachments yet.</p>;

  return (
    <ul className="flex flex-col divide-y divide-white/5">
      {items.map((item) => (
        <li key={item.attachmentId} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
          <HiOutlineCheckCircle size={13} className="text-green-500 flex-shrink-0" />
          <span className="text-xs text-gray-200 flex-1 truncate">{item.title ?? "Untitled"}</span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 flex-shrink-0"
            >
              <HiOutlineExternalLink size={12} />
            </a>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => onRemove(item.attachmentId)}
            className="text-gray-500 hover:text-red-400 disabled:opacity-50 flex-shrink-0"
          >
            <HiOutlineTrash size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}

// ── Picker dropdown ──────────────────────────────────────────────────────────

type PickerProps = {
  tab: "issue" | "pull_request" | "commit";
  setTab: (t: "issue" | "pull_request" | "commit") => void;
  getItems: () => (GitHubPullRequest | GitHubIssue | GitHubCommit)[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  onAttach: (
    type: GitHubAttachmentType,
    payload: { number?: number; sha?: string; title: string; url: string },
  ) => void;
  onClose: () => void;
};

function Picker({ tab, setTab, getItems, loading, error, saving, onAttach, onClose }: PickerProps) {
  const tabs: { id: GitHubAttachmentType; label: string }[] = [
    { id: "issue", label: "Issues" },
    { id: "pull_request", label: "PRs" },
    { id: "commit", label: "Commits" },
  ];

  const items = getItems();

  return (
    <div className="mt-2 rounded-md border border-white/10 bg-white/5">
      <div className="flex border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-semibold transition-colors",
              tab === t.id ? "text-white bg-white/10" : "text-gray-400 hover:text-gray-200",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="max-h-[200px] overflow-y-auto divide-y divide-white/5">
        {loading && <p className="text-xs text-gray-400 px-3 py-3">Loading GitHub data...</p>}
        {error && <p className="text-xs text-red-400 px-3 py-3">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-xs text-gray-500 px-3 py-3">No {tab.replace("_", " ")}s found.</p>
        )}
        {!loading &&
          !error &&
          items.map((item) => {
            const num = "number" in item ? item.number : null;
            const title = "title" in item ? item.title : "message" in item ? item.message : "";
            const url = item.url ?? "";
            const label = num !== null ? `#${num} ${title}` : title;

            const handleAttach = () => {
              const sha = "sha" in item ? item.sha : undefined;
              onAttach(tab, num !== null ? { number: num, title, url } : { sha, title, url });
              onClose();
            };

            return (
              <li key={num ?? ("sha" in item ? item.sha : item.url)}>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleAttach}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                >
                  <HiOutlinePlus size={11} className="text-gray-500 flex-shrink-0" />
                  <span className="truncate flex-1">{label}</span>
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function GitHubPanel({ repo, boardId, taskId, onLinkRequest }: Props) {
  const repoId = repo?.id?.toString() ?? null;

  const { attachments, loading, saving, attach, remove } = useGitHubAttachments({ taskId });
  const {
    loading: infoLoading,
    error,
    tab,
    setTab,
    open,
    togglePicker,
    closePicker,
    list,
  } = useGitHubPicker({
    boardId,
    repositoryId: repoId,
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <SiGithub size={14} className="text-gray-400" />
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wide">GitHub</h3>
      </div>

      {/* Repo link */}
      {!repo ? (
        <>
          <button
            type="button"
            onClick={onLinkRequest}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-gray-200 bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <SiGithub size={13} />
            Link repository
          </button>
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
            Attach PRs, commits, and issues to this task.
          </p>
        </>
      ) : (
        <a
          href={repo.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-gray-200 bg-white/10 hover:bg-white/15 transition-colors"
        >
          <SiGithub size={13} className="text-gray-400" />
          <span className="truncate flex-1">{repo.fullName}</span>
          <HiOutlineExternalLink size={11} className="text-gray-500" />
        </a>
      )}

      {/* Attachments */}
      <div className="mt-3 min-h-[40px]">
        <AttachList items={attachments} loading={loading} saving={saving} onRemove={remove} />
      </div>

      {/* Attach button */}
      {repo && (
        <button
          type="button"
          onClick={togglePicker}
          className="w-full flex items-center justify-between mt-3 px-3 py-2 rounded-md text-xs font-medium text-gray-300 bg-white/10 hover:bg-white/15 transition-colors"
        >
          <span className="flex items-center gap-2">
            <HiOutlinePlus size={12} />
            Attach item
          </span>
          <HiOutlineChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
        </button>
      )}

      {/* Picker */}
      {open && (
        <Picker
          tab={tab}
          setTab={setTab}
          getItems={list}
          loading={infoLoading}
          error={error}
          saving={saving}
          onAttach={attach}
          onClose={closePicker}
        />
      )}
    </div>
  );
}
