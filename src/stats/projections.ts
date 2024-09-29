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
    return accumulator + (value * mapped.weight * gameProgressRemaining)
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

function getPlayerProjectionsForFantasyTeam(
  fantasyTeam: yahoo.YahooTeam, // team and player response from yahoo
  players: sleeper.SleeperPlayer[],
): sleeper.SleeperPlayer[] {
  const fantasyTeamPlayers = fantasyTeam.players;
  return players.filter(sleeperPlayer => {
    return fantasyTeamPlayers.some(yahooPlayer => {
      if (yahooPlayer.player.primary_position === 'DEF') {
        return yahooPlayer.player.editorial_team_abbr.toUpperCase() === sleeperPlayer.player_id;
      } else {
        return (
          yahooPlayer.player.name.full === sleeperPlayer.full_name &&
          yahooPlayer.player.uniform_number === sleeperPlayer.number?.toString() &&
          yahooPlayer.player.editorial_team_abbr.toUpperCase() === sleeperPlayer.team
        );
      }
    });
  });
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

    const fantasyTeamPlayers = getPlayerProjectionsForFantasyTeam(yahooTeam, allPlayerProjections);

    const remainingProj = calculateRemainingTeamProjection(games, fantasyTeamPlayers);
    return {
      teamId: team.teamId,
      points: team.points + remainingProj
    }
  });
}
