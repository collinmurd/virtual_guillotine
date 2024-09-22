import 'server-only';

import { cookies } from "next/headers";
import { getSession } from "./session";
import { parseStringPromise } from 'xml2js';
import constants from "./constants";

async function getAuth() {
  const session = await getSession(cookies());
  return `Bearer ${session?.accessToken}`;
}

export async function getLeague() {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.LEAGUE_ID}`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await parseStringPromise(await resp.text())).fantasy_content.league[0];
}

export async function getLeagueStatsForWeek(week: string = "current") {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.LEAGUE_ID}/teams/stats;type=week;week=${week}`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await parseStringPromise(await resp.text())).fantasy_content.league[0];
}