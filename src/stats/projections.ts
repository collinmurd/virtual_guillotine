import * as espn from "@/apis/espn";
import  * as sleeper from "@/apis/sleeper";
import { stats } from "./statMap";
import * as yahoo from "@/apis/yahoo";


// only a subset of data I need rn from espn
interface GameStatus {
  name: string, // in the form (TEAMA @ TEAMB) where the TEAMs are abbreviated
  clock: number,
  quarter: number
}
async function getGameStatuses(): Promise<GameStatus[]> {
  const scoreboard = await espn.getNFLScoreboard();

  return scoreboard.events.map((event: any) => {
    return {
      name: event.shortName,
      clock: event.competitions[0].status.clock,
      quarter: event.competitions[0].status.period
    }
  });
}

function calculateRemainingPlayerProjection(game: GameStatus | null, playerProjections: {[stat: string]: number}): number {
  // ignoring OT possibilities for now
  let gameProgressRemaining = 1;
  if (game) {
    const quartersCompleted = game.quarter - 1;
    const secondsCompletedInQuarter = 60 * 15 - game.clock; 
    const completedSeconds = quartersCompleted * 60 * 15 + secondsCompletedInQuarter;
    gameProgressRemaining = 1 - (completedSeconds / 3600);
  }

  return Object.entries(playerProjections).reduce((accumulator, [stat, value]) => {
    const mapped = stats[stat];
    if (mapped) {
      return accumulator + (value * mapped.weight * gameProgressRemaining);
    } else {
      return accumulator;
    }
  }, 0);
}

function calculateRemainingTeamProjection(games: GameStatus[], players: sleeper.SleeperPlayer[]): number {
  return players.reduce((accumulator, player) => {
    if (player.team) {
      const game = games.find(g => g.name.includes(player.team!)) || null;
      return accumulator + calculateRemainingPlayerProjection(game, player.projections!);
    } else {
      return accumulator;
    }
  }, 0);
}

// returns a list of SleeperPlayers for a given Team. returns a null entry if the player is on bye
function getPlayerProjectionsForFantasyTeam(
  current_week: number,
  fantasyTeam: yahoo.YahooTeam, // team and player response from yahoo
  sleeperPlayers: sleeper.SleeperPlayer[],
): (sleeper.SleeperPlayer | null)[] {
  return fantasyTeam.players!.map(yahooPlayer => {
    if (yahooPlayer.player.bye_weeks.week === current_week.toString()) {
      return null;
    }
    const match = sleeperPlayers.find(sleeperPlayer => matchPlayer(sleeperPlayer, yahooPlayer.player))!;
    if (!match) {
      throw new Error(`Failed to match Yahoo & Sleeper player:\n${JSON.stringify(yahooPlayer.player)}`);
    }
    return match;
  });
}

function matchPlayer(sleeperPlayer: sleeper.SleeperPlayer, yahooPlayer: yahoo.YahooPlayer): boolean {
  if (yahooPlayer.primary_position === 'DEF') {
    return yahooPlayer.editorial_team_abbr.toUpperCase() === sleeperPlayer.player_id;
  } else {
    const suffix = [' II', ' III', ' IV', ' Jr', ' Jr.', ' Sr', ' Sr.'].find(suffix => yahooPlayer.name.full.endsWith(suffix))
    let yahooName = yahooPlayer.name.full;
    if (suffix) {
      yahooName = yahooName.replace(suffix, "").trim();
    }

    return (
      yahooName === sleeperPlayer.full_name &&
      yahooPlayer.uniform_number === sleeperPlayer.number?.toString() &&
      yahooPlayer.editorial_team_abbr.toUpperCase() === sleeperPlayer.team
    );
  }
}

export async function getAllLeagueProjections(
  week: number,
  currentScores: {teamId: number, points: number}[]
): Promise<{
  teamId: number,
  points: number
}[]> {
  const games = await getGameStatuses();
  const allPlayerProjections = await sleeper.getAllPlayerProjections(week);
  const fantasyTeamsAndPlayers = await yahoo.getTeamsWithPlayers();

  return currentScores.map(team => {
    const yahooTeam = fantasyTeamsAndPlayers.find(t => t.team_id === team.teamId.toString());
    if (!yahooTeam) {
      throw new Error("Team not found in Yahoo response");
    }

    // filter out nulls (bye weeks)
    const fantasyTeamPlayers = getPlayerProjectionsForFantasyTeam(week, yahooTeam, allPlayerProjections)
      .filter(p => p != null);

    const remainingProj = calculateRemainingTeamProjection(games, fantasyTeamPlayers);
    return {
      teamId: team.teamId,
      points: team.points + remainingProj
    }
  });
}
