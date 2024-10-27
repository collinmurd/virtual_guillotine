import 'server-only';

import { getSession } from '@/session';
import constants from '@/constants';

async function getAuth() {
  const session = await getSession();
  return `Bearer ${session?.accessToken}`;
}

export async function getLeague(): Promise<YahooLeague> {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.YAHOO_LEAGUE_ID}?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.league;
}

export async function getLeagueStatsForWeek(week: string = "current"): Promise<YahooTeam[]> {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.YAHOO_LEAGUE_ID}/teams/stats;type=week;week=${week}?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.league.teams.map((t: any) => t.team);
}

export async function getTeamsWithRoster(): Promise<YahooTeam[]> {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.${constants.YAHOO_LEAGUE_ID}/teams/roster?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.league.teams.map((t: any) => t.team);
}

export async function getTeamWithPlayersAndStats(teamId: string, week: string = "current"): Promise<YahooTeam> {
  const resp = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/team/nfl.l.${constants.YAHOO_LEAGUE_ID}.t.${teamId}/players/stats;type=week;week=${week}?format=json_f`, {
      headers: {
        'Authorization': await getAuth()
      }
    }
  );

  return (await resp.json()).fantasy_content.team;
}

export async function getFABTransactions(page: number = 1): Promise<string> {
  let count = "";
  if (page > 1) {
    count = "&count=" + (page - 1) * 25;
  }
  const resp = await fetch(
    'https://football.fantasysports.yahoo.com/f1/268706/transactions?transactionsfilter=faab&ajaxrequest=1' + count
  )

  return (await resp.json()).content;
}

// TYPES
export interface YahooLeague {
  league_id: string,
  name: string,
  num_teams: number,
  current_week: number,
  season: string
}

export interface YahooTeam {
  team_id: string,
  name: string,
  roster?: {
    players: {
      player: YahooPlayer
    }[]
  },
  players?: {
    player: YahooPlayer
  }[]
  team_points?: {
    coverage_type: string,
    week: string,
    total: string
  },
  team_projected_points?: {
    coverage_type: string,
    week: string,
    total: string
  }
}

export interface YahooPlayer {
  player_id: string,
  name: {
    full: string,
    first: string,
    last: string | null
  },
  editorial_team_abbr: string,
  bye_weeks: { week: string },
  uniform_number: string | null,
  primary_position: string,
  selected_position?: {
    position: string,
    isFlex: 1 | 0
  },
  player_stats?: {
    stats: {
      stat: {
        stat_id: string,
        value: number
      }
    }[]
  }
}
