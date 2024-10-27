import { getSession } from "@/session";
import LoadError from "@/shared-components/load-error";
import { LoadingFallback } from "@/shared-components/loading-fallback";
import { getTransactions } from "@/stats/transactions";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
  params, // eslint-disable-line
  searchParams,
}: {
  params: any,
  searchParams: { [key: string]: string | string[] | undefined | null }
}) {
  if (!(await getSession())) {
    return <></>
  }

  let page = 1;
  if (searchParams.page && typeof searchParams.page === 'string' && !isNaN(searchParams.page as any)) {
    page = parseInt(searchParams.page);
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Content page={page} />
    </Suspense>
  )
}

async function Content(props: {page: number}) {
  const transactions = await getTransactions(props.page).catch(() => null);
  if (!transactions) {
    return <LoadError />
  }

  const transactionSections = transactions.map((t, i) => {
    const bidRows = [<BidRow key={t.teamId} teamId={t.teamId} teamName={t.teamName} bid={t.winningBid} className="text-lime-400"/>]
    t.failedBids.sort((a, b) => b.bid - a.bid).forEach(b => {
      bidRows.push(<BidRow key={b.teamId} teamId={b.teamId} teamName={b.teamName} bid={b.bid} className="text-gray-400"/>)
    })
    return (
      <div key={t + "" + i} className="my-2">
        <div className="flex justify-between">
          <p className="text-base sm:text-lg">{t.playerName}</p>
          <p>{t.date}</p>
        </div>
        <table>
          {bidRows}
        </table>
      </div>
    )
  });

  return (
    <div>
      {transactionSections}
    </div>
  );
}

function BidRow(props: {teamId: number, teamName: string, bid: number, className?: string}) {
  return (
    <tr className={props.className}>
      <td className="px-3">${props.bid}</td>
      <td><Link href={"guillotine/team?team=" + props.teamId}>{props.teamName}</Link></td>
    </tr>
  )
}