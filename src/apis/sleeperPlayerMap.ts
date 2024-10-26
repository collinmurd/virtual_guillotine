
import * as fs from 'fs';
import { SleeperPlayer } from "./sleeper";

const PATH = 'data/sleeperPlayerMap.json'

let playerMap: { [player_id: string]: SleeperPlayer } = {}
if (fs.existsSync(PATH)) {
  playerMap = JSON.parse(fs.readFileSync(PATH, 'utf8'));
}

export default playerMap;
