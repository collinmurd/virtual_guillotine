
import { round } from '@/stats/projections';
import * as yahoo from '../../apis/yahoo';

const positions = [
  "QB",
  "WR",
  "WR",
  "RB",
  "RB",
  "TE",
  "W/R/T",
  "K",
  "DEF",
]

interface LineupData {
  player: yahoo.YahooPlayer | null,
  currentScore: number,
  projectedScore: number
}
export function Lineup(props: {data: LineupData[], compareData?: LineupData[]}) {

  const playersInPlay = props.data.filter(p => p.player?.selected_position?.position !== 'BN');
  const selectedPlayers: string[] = [];

  return (
    <table className="mt-3 text-xs sm:text-base w-full">
      <tbody>
        {rows}
        <tr>
          <td></td>
          <td className="px-2 border border-collapse border-lime-400 text-right">
            <p>{sumPoints(playersInPlay, 'currentScore')}</p>
            <p className="text-[10px] text-gray-400">{sumPoints(playersInPlay, 'projectedScore')}</p>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}

function mapPlayersToPositions(players: LineupData[]): {[pos: string]: LineupData} {
  return positions.map((pos, i) => {
    const player = playersInPlay.find(p => 
      p.player?.selected_position?.position === pos && !selectedPlayers.includes(p.player.player_id)
    );
    selectedPlayers.push(player?.player?.player_id!);

    const name = player ? abbrPlayerName(player.player!) : "H. McCringleberry";
    const score = player ? player.currentScore : 0;
    const proj = player ? player.projectedScore : 0;

  });
}


function sumPoints(data: LineupData[], key: 'currentScore' | 'projectedScore') {
  return round(data.reduce((accumulator, player) => accumulator + player[key], 0));
}

function abbrPlayerName(player: yahoo.YahooPlayer) {
  if (player.name.last) {
    return player.name.first.charAt(0) + ". " + player.name.last;
  }

  return player.name.first;
}


interface LineupRowProps {
  position: string,
  playerA: {name: string, score: number, proj: number},
  playerB?: {name: string, score: number, proj: number}
}
function LineupRow(props: LineupRowProps) {


  return (
    <tr>
      <td className="px-2 border border-collapse border-lime-400">{props.playerA.name}</td>
      <td className="px-2 border border-collapse border-lime-400 text-right">
        <p>{props.playerA.score}</p>
        <p className="text-[10px] text-gray-400">{props.playerA.proj}</p>
      </td>
      <th className="px-1 sm:px-3" scope="row">{props.position}</th>
      {props.playerB &&
        <td className="px-2 border border-collapse border-lime-400 text-right">
          <p>{props.playerB.score}</p>
          <p className="text-[10px] text-gray-400">{props.playerB.proj}</p>
        </td>
      }
      {props.playerB && <td className="px-2 border border-collapse border-lime-400">{props.playerA.name}</td>}
    </tr>
  );
}
