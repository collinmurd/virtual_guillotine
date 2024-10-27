
import { getFABTransactions } from '@/apis/yahoo';
import { getTransactions } from '@/stats/transactions';
import fs from 'fs'

jest.mock('../apis/yahoo');

describe('getTransactions', () => {
  beforeAll(() => {
    const content = fs.readFileSync('src/tests/data/fab-transaction-resp.txt', 'utf8');
    (getFABTransactions as jest.Mock).mockReturnValue(content);
  });

  test('tests are loading data from filesystem', () => {
    expect(getFABTransactions()).toBeTruthy();
  });

  test('parses html response for transaction data', async () => {
    const result = (await getTransactions()).find(t => t.playerId === 30182); // Cooper Kupp

    expect(result).toBeTruthy();
  });

  test('contains information on transaction winner', async () => {
    const result = (await getTransactions()).find(t => t.playerId === 30182); // Cooper Kupp

    expect(result!.teamId).toEqual(6);
    expect(result!.winningBid).toEqual(188);
    expect(result!.date).toEqual("Oct 23");
  });

  test('contains information on transaction losers', async () => {
    const result = (await getTransactions()).find(t => t.playerId === 41048); // Tyrone Tracy Jr.

    expect(result!.failedBids.length).toEqual(1);
    expect(result!.failedBids[0].bid).toEqual(0);
    expect(result!.failedBids[0].teamId).toEqual(11);
  });

  test('parses defenses correctly', async () => {
    const result = (await getTransactions()).find(t => t.playerId === 100008); // Detroit defense

    expect(result).toBeTruthy();
    expect(result!.teamId).toEqual(17);
    expect(result!.winningBid).toEqual(2);
    expect(result!.failedBids.length).toEqual(2);
  });
});