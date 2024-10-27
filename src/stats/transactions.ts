
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
  content = content.replace('\\"', '"'); // replace escaped quotes

  const dom = new JSDOM(content);
  const transactionTable = dom.window.document.querySelector("table");

  return [];
}