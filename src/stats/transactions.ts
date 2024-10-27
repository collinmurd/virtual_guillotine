
import { JSDOM } from "jsdom";
import * as yahoo from "../apis/yahoo";

export interface Transaction {
  playerId: number,
  teamId: number,
  winningBid: number,
  failedBids: {
    teamId: number,
    bid: number
  }[]
}

// return transactions from the FAB transactions tab on yahoo. each page contains 25.
// yahoo doesn't have a rest API for this... but they do have an API that returns the
//    transaction table HTML content
export async function getTransactions(page: number = 1): Promise<Transaction[]> {
  let content = await yahoo.getFABTransactions(page);
  content = content.replaceAll('\\"', '"'); // replace escaped quotes

  const dom = new JSDOM(content);
  const transactionTableRows = dom.window.document.querySelectorAll("tr");

  const result: Transaction[] = [];
  transactionTableRows.forEach(row => {
    const firstColumn = row.children[1]; // second td element
    const playerLink = firstColumn.querySelectorAll("a")[1]; // second a element
    const winningBid = firstColumn.querySelector("h6"); // first (only) h6
    const losingBids = firstColumn.querySelector("div")?.querySelectorAll("p"); // all p inside first (only) div

    const secondColumn = row.children[3]; // last td element
    const winningTeamLink = secondColumn.querySelector("span")?.querySelector("a"); // first a inside first span

    result.push({
      playerId: parseInt(playerLink.getAttribute('data-ys-playerid')!),
      teamId: parseInt(winningTeamLink?.href.split("/").at(-1)!),
      winningBid: parseInt(winningBid?.textContent?.match(/\$([0-9]+) Winning Offer/)![1]!),
      failedBids: losingBids?.values()!.map(p => {
        return {
          teamId: parseInt(p.querySelector("a")?.href.split("/").at(-1)!), // first a
          bid: parseInt(p.textContent?.match(/\$([0-9]+)/)![1]!)
        }
      }).toArray()!
    })
  });

  return result;
}