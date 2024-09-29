import 'server-only';

import { cookies } from "next/headers";
import { getSession } from '@/session';
import constants from '@/constants';

async function getAuth() {
  const session = await getSession(cookies());
  return `Bearer ${session?.accessToken}`;
}

export async function getLeague() {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.YAHOO_LEAGUE_ID}?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.league;
}

export async function getLeagueStatsForWeek(week: string = "current") {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.YAHOO_LEAGUE_ID}/teams/stats;type=week;week=${week}?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.league;
}

export async function getTeamsWithPlayers(): Promise<YahooTeam[]> {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.YAHOO_LEAGUE_ID}/teams/players?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.league.teams.map((t: any) => t.team);
}


// TYPES
export interface YahooTeam {
  team_id: string,
  name: string,
  players: {
    player: YahooPlayer
  }[]
}

export interface YahooPlayer {
  player_id: string,
  name: {
    full: string,
    first: string,
    last: string | null
  },
  editorial_team_abbr: string,
  by_weeks: { week: string }[],
  uniform_number: string | null,
  primary_position: string
}
