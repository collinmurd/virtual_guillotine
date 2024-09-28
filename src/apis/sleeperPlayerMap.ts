
import * as fs from 'fs';
import { SleeperPlayer } from "./sleeper";

const playerMap: { [player_id: string]: SleeperPlayer } = JSON.parse(fs.readFileSync('data/sleeperPlayerMap.json', 'utf8'));

export default playerMap;
