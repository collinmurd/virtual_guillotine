
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

interface LineupPlayerData {
  player: yahoo.YahooPlayer | null,
  currentScore: number,
  projectedScore: number
}
export function Lineup(props: {data: LineupPlayerData[], compareData?: LineupPlayerData[]}) {
  const isComparing = props.compareData != undefined;

  const selectedPlayerAIds: string[] = [];
  const selectedPlayerBIds: string[] = [];
  const rows = positions.map((pos, i) => {
    const playerA = findPlayer(props.data, pos, selectedPlayerAIds);
    if (isComparing) {
      const playerB = findPlayer(props.compareData!, pos, selectedPlayerBIds);
      return <LineupRow
              key={pos + i}
              position={pos}
              playerA={playerRowDetails(playerA, true)}
              playerB={playerRowDetails(playerB, true)} />
    } else {
      return <LineupRow
              key={pos + i}
              position={pos}
              playerA={playerRowDetails(playerA, false)} />
    }
  });

  return (
    <table className={"mt-3 text-xs sm:text-base w-full mx-auto table-fixed" + (isComparing ? "" : " max-w-sm")}>
      <tbody>
        {rows}
        {isComparing ?
          <TotalsRow 
            playerAScore={sumPoints(props.data, "currentScore")}
            playerAProj={sumPoints(props.data, "projectedScore")}
            playerBScore={sumPoints(props.compareData!, "currentScore")}
            playerBProj={sumPoints(props.compareData!, "projectedScore")}
            />
          :
          <TotalsRow
            playerAScore={sumPoints(props.data, "currentScore")}
            playerAProj={sumPoints(props.data, "projectedScore")}
            />
        }
      </tbody>
    </table>
  )
}

interface LineupRowProps {
  position: string,
  playerA: {name: string, score: number, proj: number}
  playerB?: {name: string, score: number, proj: number}
}
function LineupRow(props: LineupRowProps) {
  return (
    <tr>
      <td className="px-2 border border-collapse border-lime-400">{props.playerA.name}</td>
      <td className="px-2 border border-collapse border-lime-400 text-right w-14 sm:w-20">
        <p>{props.playerA.score}</p>
        <p className="text-[10px] text-gray-400">{props.playerA.proj}</p>
      </td>
      <th className="px-1 sm:px-3 w-[12%]" scope="row">{props.position}</th>
      {props.playerB &&
        <td className="px-2 border border-collapse border-lime-400 text-right w-14 sm:w-20">
          <p>{props.playerB.score}</p>
          <p className="text-[10px] text-gray-400">{props.playerB.proj}</p>
        </td>
      }
      {props.playerB && <td className="px-2 border border-collapse border-lime-400">{props.playerB.name}</td>}
    </tr>
  );
}

interface TotalsRowProps {
  playerAScore: number,
  playerAProj: number,
  playerBScore?: number,
  playerBProj?: number
}
function TotalsRow(props: TotalsRowProps) {
  return (
    <tr>
      <td></td>
      <td className="px-2 border border-collapse border-lime-400 text-right w-14 sm:w-20">
        <p>{props.playerAScore}</p>
        <p className="text-[10px] text-gray-400">{props.playerAProj}</p>
      </td>
      <td></td>
      {props.playerBScore != undefined &&
        <td className="px-2 border border-collapse border-lime-400 text-right w-14 sm:w-20">
          <p>{props.playerBScore}</p>
          <p className="text-[10px] text-gray-400">{props.playerBProj}</p>
        </td>
      }
      {props.playerBScore != undefined && <td></td>}
    </tr>
  )
}

function sumPoints(data: LineupPlayerData[], key: 'currentScore' | 'projectedScore') {
  return round(data.reduce((accumulator, player) => accumulator + player[key], 0));
}

function abbrPlayerName(player: yahoo.YahooPlayer) {
  if (player.name.last) {
    return player.name.first.charAt(0) + ". " + player.name.last;
  }

  return player.name.first;
}

function findPlayer(data: LineupPlayerData[], pos: string, selectedPlayerIds: string[]) {
  const result = data.find(p => 
    p.player?.selected_position?.position === pos && !selectedPlayerIds.includes(p.player.player_id)
  );

  if (result) {
    selectedPlayerIds.push(result.player?.player_id!);
  }

  return result || null;
}

function playerRowDetails(data: LineupPlayerData | null, abbrName: boolean = true): {name: string, score: number, proj: number} {
  if (data) {
    return {
      name: abbrName ? abbrPlayerName(data.player!): data.player?.name.full!,
      score: data.currentScore,
      proj: data.projectedScore
    }
  } else {
    return {
      name: abbrName ? "H. McCringleberry" : "Hingle McCringleberry",
      score: 0,
      proj: 0
    }
  }
}
