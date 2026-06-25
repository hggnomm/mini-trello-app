import { FaCodeBranch, FaCode, FaExclamationCircle } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { HiOutlineExternalLink, HiOutlineChatAlt2 } from "react-icons/hi";
import type { GitHubRepository } from "@/api/board";
import { cn } from "@/utils/cn";

type GitHubPanelProps = {
  repo: GitHubRepository | undefined | null;
  onLinkRequest?: () => void;
};

function GitHubActionButton({
  icon,
  label,
  href,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  disabled?: boolean;
}) {
  const className = cn(
    "w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-300 transition-colors text-left font-medium",
    disabled
      ? "bg-white/[0.03] opacity-50 cursor-not-allowed"
      : "bg-white/[0.06] hover:bg-white/[0.12] cursor-pointer",
  );

  if (disabled || !href) {
    return (
      <div className={className}>
        <span className="text-gray-400">{icon}</span>
        {label}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span className="text-gray-400">{icon}</span>
      {label}
      <HiOutlineExternalLink size={11} className="ml-auto text-gray-500" />
    </a>
  );
}

export default function GitHubPanel({ repo, onLinkRequest }: GitHubPanelProps) {
  if (!repo) {
    return (
      <div>
        <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wide mb-1.5">GitHub</p>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={onLinkRequest}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-gray-300 bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-left font-medium cursor-pointer"
          >
            <SiGithub size={14} />
            Link repository
          </button>
          <p className="text-[11px] text-gray-500 leading-relaxed px-1">
            Link a GitHub repository to this board to view commits, pull requests and more.
          </p>
        </div>
      </div>
    );
  }

  const commitsUrl = `${repo.url}/commits`;
  const branchesUrl = `${repo.url}/branches`;
  const pullsUrl = `${repo.url}/pulls`;
  const issuesUrl = `${repo.url}/issues`;

  return (
    <div>
      <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wide mb-1.5">GitHub</p>

      <div className="flex flex-col gap-1.5">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded text-xs text-gray-200 bg-white/[0.08] hover:bg-white/[0.14] transition-colors font-semibold"
          title={repo.fullName}
        >
          <SiGithub size={14} className="text-gray-300" />
          <span className="truncate">{repo.fullName}</span>
          <HiOutlineExternalLink size={11} className="ml-auto text-gray-500" />
        </a>

        <GitHubActionButton
          icon={<FaCode size={12} />}
          label="Commits"
          href={commitsUrl}
        />
        <GitHubActionButton
          icon={<FaCodeBranch size={12} />}
          label="Pull requests"
          href={pullsUrl}
        />
        <GitHubActionButton
          icon={<FaCodeBranch size={12} />}
          label="Branches"
          href={branchesUrl}
        />
        <GitHubActionButton
          icon={<FaExclamationCircle size={12} />}
          label="Issues"
          href={issuesUrl}
        />
        <GitHubActionButton
          icon={<HiOutlineChatAlt2 size={13} />}
          label="Discussions"
          href={`${repo.url}/discussions`}
        />
      </div>
    </div>
  );
}
