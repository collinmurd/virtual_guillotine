import { getNFLScoreboard } from "@/apis/espn";
import { getAllPlayerProjections, SleeperPlayer } from "@/apis/sleeper";
import { stats } from "./statMap";
import { getTeamsWithPlayers } from "@/apis/yahoo";


// only a subset of data I need rn from espn
interface GameStatus {
  name: string, // in the form (TEAMA @ TEAMB) where the TEAMs are abbreviated
  clock: number,
  quarter: number
}
async function getGameStatuses(): Promise<GameStatus[]> {
  const scoreboard = await getNFLScoreboard();

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
  let gameProgress = 1;
  if (game) {
    gameProgress = (60 * 15 - game.clock) + (game.quarter - 1) * 600;
  }

  return Object.entries(playerProjections).reduce((accumulator, [stat, value]) => {
    const mapped = stats[stat];
    return accumulator + (value * mapped.weight * gameProgress)
  }, 0);
}

function calculateRemainingTeamProjection(games: GameStatus[], players: SleeperPlayer[]): number {
  return players.reduce((accumulator, player) => {
    if (player.team) {
      const game = games.find(g => g.name.includes(player.team!)) || null;
      return accumulator + calculateRemainingPlayerProjection(game, player.projections!);
    } else {
      return accumulator;
    }
  }, 0);
}

export async function getAllLeagueProjections(
  week: number,
  currentScores: {teamId: number, points: number}[]
): Promise<{
  teamId: number,
  points: number
}[]> {
  const games = await getGameStatuses();
  const playerProjections = await getAllPlayerProjections(week);
  const teamsAndPlayers = await getTeamsWithPlayers();

  return currentScores.map(team => {
    return {
      teamId: team.teamId,
      points: calculateRemainingTeamProjection(games, [])
    }
  });
}
