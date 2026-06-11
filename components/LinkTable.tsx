"use client";
import { BarChart3, Clock, MousePointerClick, Search } from "lucide-react";
import Link from "next/link";

import CopyButton from "./CopyButton";
import DeleteButton from "./DeleteButton";
import QRButton from "./QRButton";
import { useState } from "react";

type LinkItem = {
  id: string;
  slug: string;
  originalUrl: string;
  totalClicks: number;
  createdAt: Date;
  expiresAt: Date | null;
};

type Props = {
  links: LinkItem[];
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function LinkStatus({ expiresAt }: { expiresAt: Date | null }) {
  if (!expiresAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.14)] bg-[rgba(34,197,94,0.08)] px-2 py-0.5 text-[0.65rem] font-medium text-[#16a34a]">
        Active
      </span>
    );
  }
  const expired = new Date(expiresAt) < new Date();
  return expired ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(239,68,68,0.14)] bg-[rgba(239,68,68,0.08)] px-2 py-0.5 text-[0.65rem] font-medium text-[#dc2626]">
      Expired
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(245,158,11,0.14)] bg-[rgba(245,158,11,0.08)] px-2 py-0.5 text-[0.65rem] font-medium text-[#d97706]">
      <Clock className="size-2.5" />
      Expires {formatDate(expiresAt)}
    </span>
  );
}

export default function LinkTable({ links }: Props) {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filterLink = links.filter(
    (link) =>
      link.slug.toLowerCase().includes(search.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filterLink.length / ITEMS_PER_PAGE);
  const paginatedLinks = filterLink.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[rgba(148,163,184,0.18)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#0f172a]">Links</p>
          <span className="rounded-full border border-[rgba(148,163,184,0.14)] bg-[rgba(255,255,255,0.6)] px-2 py-0.5 text-xs text-[#64748b]">
            {filterLink.length}
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="field-input h-9 w-full pl-9 pr-3 sm:w-60"
          />
        </div>
      </div>

      {/* Empty state */}
      {filterLink.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
          <div className="empty-state-orb">
            <MousePointerClick className="size-5" />
          </div>
          <div>
            <p className="font-medium text-[#0f172a]">No links yet</p>
            <p className="mt-1 text-sm text-[#475569]">
              {search
                ? "No links match your search."
                : "Create your first short link above."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(148,163,184,0.18)] text-xs text-[#64748b]">
                  <th className="px-4 py-2.5 font-medium">Short link</th>
                  <th className="px-4 py-2.5 font-medium">Destination</th>
                  <th className="px-4 py-2.5 font-medium">Clicks</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Created</th>
                  <th className="px-4 py-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(148,163,184,0.1)]">
                {paginatedLinks.map((link) => (
                  <tr
                    key={link.id}
                    className="group transition-colors hover:bg-[rgba(255,255,255,0.44)]"
                  >
                    <td className="px-4 py-2.5 align-middle">
                      <p className="font-mono text-sm font-medium text-[#4f46e5]">
                        /{link.slug}
                      </p>
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <p className="max-w-[24rem] truncate text-sm text-[#64748b]">
                        {link.originalUrl}
                      </p>
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0f172a]">
                        <MousePointerClick className="size-3.5 text-[#64748b]" />
                        {link.totalClicks}
                      </span>
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <LinkStatus expiresAt={link.expiresAt} />
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <p className="text-xs text-[#64748b]">
                        {formatDate(link.createdAt)}
                      </p>
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/${link.slug}`}
                          className="action-button"
                          title="Analytics"
                          aria-label={`View analytics for ${link.slug}`}
                        >
                          <BarChart3 className="size-4" />
                        </Link>
                        <QRButton
                          shortUrl={`${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`}
                        />
                        <CopyButton slug={link.slug} />
                        <DeleteButton id={link.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-[rgba(148,163,184,0.1)] lg:hidden">
            {paginatedLinks.map((link) => (
              <div
                key={link.id}
                className="p-4 transition-colors hover:bg-[rgba(255,255,255,0.4)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium text-[#4f46e5]">
                      /{link.slug}
                    </p>
                    <p className="mt-1 truncate text-sm text-[#64748b]">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-medium text-[#0f172a]">
                      {link.totalClicks} clicks
                    </span>
                    <LinkStatus expiresAt={link.expiresAt} />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Link
                    href={`/dashboard/${link.slug}`}
                    className="action-button"
                    title="Analytics"
                    aria-label={`View analytics for ${link.slug}`}
                  >
                    <BarChart3 className="size-4" />
                  </Link>
                  <QRButton
                    shortUrl={`${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`}
                  />
                  <CopyButton slug={link.slug} />
                  <DeleteButton id={link.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.34)] px-4 py-3">
          <p className="text-xs text-[#64748b]">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="secondary-button h-8 px-3 text-xs"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="secondary-button h-8 px-3 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
