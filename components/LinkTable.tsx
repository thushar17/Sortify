"use client"
import { ArrowUpRight, Link2, MousePointerClick } from "lucide-react";
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
};

type Props = {
  links: LinkItem[];
};

export default function LinkTable({ links }: Props) {
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [search , setSearch] = useState("")


  // filter 
  const filterLink = links.filter(
    (link)=>
      link.slug
          .toLowerCase()
          .includes(search.toLowerCase())|| 
          link.originalUrl
          .toLowerCase()
          .includes(search.toLowerCase())
  )
   const totalPages = Math.ceil(
    filterLink.length /ITEMS_PER_PAGE
  )
  // paginantion
  const paginatedLinks = filterLink.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage* ITEMS_PER_PAGE

  )
  return (
    <section className="glass-card section-shell">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="eyebrow">Link Library</span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Manage every short link in one place
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Review slugs, destination URLs, click totals, and open
                analytics with a cleaner, easier-to-scan workspace.
              </p>
            </div>
          </div>

          <div className="surface-muted flex items-center gap-3 px-4 py-3 text-sm text-slate-600">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]">
              <Link2 className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {filterLink.length} {filterLink.length === 1 ? "link" : "links"} tracked
              </p>
              <p className="text-xs text-slate-500">
                Access analytics, QR codes, copy, and delete actions quickly.
              </p>
            </div>
          </div>
        </div>

        <div className="subtle-divider" />
        <div className="flex justify-end">
  <input
    type="text"
    placeholder="Search links..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
    className="field-input w-full max-w-sm"
  />
</div>
        {filterLink.length === 0 ? (
          <div className="surface-muted flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
            <div className="empty-state-orb">0</div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-950">
                No links yet
              </h3>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Create your first short link above and it will appear here with
                click totals and analytics access.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:hidden">
              {paginatedLinks.map((link) => (
                <article
                  key={link.id}
                  className="rounded-[1.75rem] border border-white/80 bg-white/78 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.07)] backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Short link
                      </p>
                      <div>
                        <p className="text-lg font-semibold text-slate-950">
                          /{link.slug}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {process.env.NEXT_PUBLIC_APP_URL}/{link.slug}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/80 bg-white/82 px-3.5 py-3 text-right shadow-[0_12px_25px_rgba(15,23,42,0.06)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Clicks
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-slate-950">
                        <MousePointerClick className="size-4 text-blue-600" />
                        {link.totalClicks}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Destination
                    </p>
                    <p className="break-all text-sm leading-6 text-slate-700">
                      {link.originalUrl}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/${link.slug}`}
                      className="secondary-button"
                    >
                      <span>View Analytics</span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                    <QRButton shortUrl={`${process.env.NEXT_PUBLIC_APP_URL}/${link.slug}`} />
                    <CopyButton slug={link.slug} />
                    <DeleteButton id={link.id} />
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-[1.9rem] border border-white/80 bg-white/78 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-[linear-gradient(180deg,rgba(248,250,255,0.92)_0%,rgba(241,245,255,0.76)_100%)]">
                      <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        <th className="px-6 py-4">Short link</th>
                        <th className="px-6 py-4">Destination</th>
                        <th className="px-6 py-4">Clicks</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200/65">
                      {paginatedLinks.map((link) => (
                        <tr
                          key={link.id}
                          className="transition duration-200 hover:bg-blue-50/45"
                        >
                          <td className="px-6 py-5 align-top">
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-950">
                                /{link.slug}
                              </p>
                              <p className="max-w-[14rem] truncate text-sm text-slate-500">
                                {process.env.NEXT_PUBLIC_APP_URL}/{link.slug}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5 align-top">
                            <p className="max-w-[26rem] truncate text-sm leading-6 text-slate-600">
                              {link.originalUrl}
                            </p>
                          </td>
                          <td className="px-6 py-5 align-top">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                              <MousePointerClick className="size-4 text-blue-600" />
                              {link.totalClicks}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/dashboard/${link.slug}`}
                                className="secondary-button"
                              >
                                <span>Analytics</span>
                                <ArrowUpRight className="size-4" />
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
              </div>
            </div>
          </>
        )}
      </div>
      {totalPages > 1 && (
  <div className="mt-6 flex items-center justify-center gap-3">
    <button
      onClick={() =>
        setCurrentPage((p) =>
          Math.max(1, p - 1)
        )
      }
      disabled={currentPage === 1}
      className="secondary-button"
    >
      Previous
    </button>

    <span className="text-sm font-medium">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() =>
        setCurrentPage((p) =>
          Math.min(totalPages, p + 1)
        )
      }
      disabled={currentPage === totalPages}
      className="secondary-button"
    >
      Next
    </button>
  </div>
)}
    </section>
  );
}
