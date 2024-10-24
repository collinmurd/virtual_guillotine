import 'server-only';
import constants from '@/constants';
import playerMap from './sleeperPlayerMap';

// only a subset of attributes in the data. only what I think I'll need
// NOTE yahoo_id and espn_id aren't filled in for some players, so I'm not going to trust them
// NOTE defenses don't have a full_name, their player ID is the abbreviated team name
export interface SleeperPlayer {
  active?: boolean,
  player_id: string,
  team?: string, // abbreviation, not full name
  full_name?: string,
  number?: number,
  age?: number,
  fantasy_positions: string[],
  injury_status?: string // this is null if there is no injury,
  projections?: {[stat: string]: number}
}


function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export async function getAllPlayerProjections(week: number): Promise<SleeperPlayer[]> {
  // TODO: handle error
  const resp = await fetch(
    `https://api.sleeper.app/v1/projections/nfl/regular/${constants.SEASON_YEAR}/${week}`
  );

  const data = await resp.json();

  return Object.entries(data as {[player_id: string]: any}).map(([player_id, proj]) => {
    if (Object.keys(playerMap).includes(player_id)) {
      const player = deepCopy(playerMap[player_id]);
      player.projections = proj
      return player;
    } else {
      return null;
    }
  }).filter(player => player != null);
}
