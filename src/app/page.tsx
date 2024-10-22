import * as yahoo from "@/apis/yahoo";
import { getSession } from "@/session";
import * as proj from '../stats/projections';
import { ScoresTable, ScoresTableData } from "./table";
import LoadError from "@/shared-components/load-error";

export default async function Page() {
  return (
    <div>
      <Scoreboard />
    </div>
  )
}

async function Scoreboard() {
  if (!(await getSession())) {
    return <></>
  }

  const [league, leagueTeams] = await Promise.all([
    yahoo.getLeague(),
    yahoo.getLeagueStatsForWeek(),
  ]).catch(e => {
    console.log(e);
    return [null, null];
  });

  if (!league || !leagueTeams) {
    return LoadError();
  }

  const leagueProjections = await proj.getAllLeagueProjections(
    league.current_week,
    leagueTeams.map(team => {return {teamId: parseInt(team.team_id), points: parseFloat(team.team_points!.total)}})
  ).catch(e => {
    console.log(e);
    return null;
  });

  if (!leagueProjections) {
    return LoadError();
  }

  leagueProjections.map(p => {
    p.points = Math.round((p.points + Number.EPSILON) * 100) / 100
  });

  const data: ScoresTableData[] = leagueTeams.map(team => {
    return {
      teamId: team.team_id,
      manager: team.name,
      score: parseFloat(team.team_points?.total!),
      proj: leagueProjections.find(t => t.teamId.toString() === team.team_id)!.points
    }
  })

  return (
    <div>
      <ScoresTable data={data}/>
    </div>
  );
}
