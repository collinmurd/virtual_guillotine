import * as yahoo from "@/apis/yahoo"
import { getSession } from "@/session";
import LoadError from "@/shared-components/load-error";
import { getTeamProjections, round } from "@/stats/projections";
import { TeamSelect } from "./team-select";
import { Suspense } from "react";
import Link from "next/link";

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

export default async function Page({
  params,
  searchParams,
}: {
  params: any,
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (!(await getSession())) {
    return <></>
  }

  let teamId = searchParams.team;
  if (!teamId || typeof teamId === 'object' || isNaN(teamId as any)) {
    teamId = "1"; // kind of hacky, default to the team with id 1
  }

  let compareTeamId: string | null = searchParams.compare as string;
  if (!compareTeamId || typeof teamId === 'object' || isNaN(teamId as any)) {
    compareTeamId = null;
  }

  return (
    <Suspense key={teamId + " " + compareTeamId} fallback={<p>Loading...</p>}>
      {
        compareTeamId ?
          <Content teamId={teamId} compareTeamId={compareTeamId} />
          : <Content teamId={teamId} />
      }
    </Suspense>
  )
}

async function getPlayerScores(league: yahoo.YahooLeague, team: yahoo.YahooTeam) {
  const playerScores = await getTeamProjections(league.current_week, team.team_id);
  // fill in "roster" player data with "stats" player data... thanks yahoo
  playerScores.forEach(ps => {
    if (ps.player) {
      ps.player!.selected_position = team?.roster?.players!.find(p =>
        p.player.player_id === ps.player?.player_id
      )?.player.selected_position;
    }
  });

  return playerScores;
}

async function Content(props: {teamId: string, compareTeamId?: string}) {
  const [teams, league] = await Promise.all([
    yahoo.getTeamsWithRoster(),
    yahoo.getLeague()
  ]).catch(e => {
    console.log(e);
    return [null, null];
  });

  if (!teams || !league) {
    return LoadError();
  }

  const team = teams.find(t => t.team_id === props.teamId);
  const playerScores = await getPlayerScores(league, team!);

  let comparePlayerScores = null;
  if (props.compareTeamId) {
    comparePlayerScores = await getPlayerScores(league, teams.find(t => t.team_id === props.compareTeamId)!);
  }

  const teamSelectData = teams.map(t => {
    return {
      name: t.name,
      id: t.team_id
    }
  });

  return (
    <div>
      <div className="flex">
        <div>
          <div className="flex flex-col items-center">
            {!comparePlayerScores ? 
              <TeamSelect teams={teamSelectData} defaultId={props.teamId} /> :
              <TeamSelect teams={teamSelectData} defaultId={props.teamId} compare defaultCompareId={props.compareTeamId} />
            }
            {!comparePlayerScores ?
              <Link
                href={`/team?team=${props.teamId}&compare=${props.teamId}`}
                replace 
                className="underline my-1">Compare
                </Link> :
              <Link
                href={`/team?team=${props.teamId}`}
                replace 
                className="underline my-1">Stop Comparing
                </Link>
            }
          </div>
          <div className="flex">
            <Lineup data={playerScores} displayPosLabels invert={false} />
            {comparePlayerScores && <Lineup data={comparePlayerScores} displayPosLabels={false} invert />}
          </div>
        </div>
      </div>
    </div>
  )
}

interface LineupData {
  player: yahoo.YahooPlayer | null,
  currentScore: number,
  projectedScore: number
}
function Lineup(props: {data: LineupData[], displayPosLabels: boolean, invert: boolean}) {

  const playersInPlay = props.data.filter(p => p.player?.selected_position?.position !== 'BN');
  const selectedPlayers: string[] = [];
  const rows = positions.map((pos, i) => {
    const player = playersInPlay.find(p => 
      p.player?.selected_position?.position === pos && !selectedPlayers.includes(p.player.player_id)
    );
    selectedPlayers.push(player?.player?.player_id!);
    const name = player ? player?.player?.name.full : "Hingle McCringleberry";
    const score = player ? player.currentScore : 0;
    const proj = player ? player.projectedScore : 0;
    return (
      <tr key={pos + i}>
        {!props.invert && <td className="px-2 border border-collapse border-lime-400">{name}</td> }
        <td className="px-2 border border-collapse border-lime-400 text-right">
          <p>{score}</p>
          <p className="text-xs text-gray-400">{proj}</p>
        </td>
        {props.invert && <td className="px-2 border border-collapse border-lime-400">{name}</td> }
        {props.displayPosLabels && <th className="px-3" scope="row">{pos}</th>}
      </tr>
    );
  });

  return (
    <table className={"mt-3"}>
      <tbody>
        {rows}
        <tr>
          {!props.invert && <td></td>}
          <td className="px-2 border border-collapse border-lime-400 text-right">
            <p>{sumPoints(playersInPlay, 'currentScore')}</p>
            <p className="text-xs text-gray-400">{sumPoints(playersInPlay, 'projectedScore')}</p>
          </td>
          {props.invert && <td></td>}
          {props.displayPosLabels && <td></td> }
        </tr>
      </tbody>
    </table>
  )
}

function sumPoints(data: LineupData[], key: 'currentScore' | 'projectedScore') {
  return round(data.reduce((accumulator, player) => accumulator + player[key], 0));
}