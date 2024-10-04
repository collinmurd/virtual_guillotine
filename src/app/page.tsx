import * as yahoo from "@/apis/yahoo";
import { getSession } from "@/session";
import { cookies } from "next/headers";
import * as proj from '../stats/projections';

export default async function Scoreboard() {
  if (!(await getSession(cookies()))) {
    return <></>
  }

  const [league, leagueStats] = await Promise.all([
    yahoo.getLeague(),
    yahoo.getLeagueStatsForWeek(),
  ]).catch(e => {
    console.log(e);
    return [null, null];
  });

  if (!league || !leagueStats) {
    return LoadError();
  }

  let leagueProjections = await proj.getAllLeagueProjections(
    league.current_week,
    leagueStats.map(team => {return {teamId: parseInt(team.team_id), points: parseFloat(team.team_points!.total)}})
  ).catch(e => {
    console.log(e);
    return null;
  });

  if (!leagueProjections) {
    return LoadError();
  }

  leagueProjections.map(p => {
    p.points = Math.round((p.points + Number.EPSILON) * 100) / 100
  })

  const tableData = leagueStats.map(team => {
    return (
      <tr key={team.team_id}>
        <th scope="row" className="flex flex-row-reverse border border-lime-400 px-3">{team.name}</th>
        <td className="border border-lime-400 px-3">{team.team_points!.total}</td>
        <td className="border border-lime-400 px-3">{leagueProjections.find(t => t.teamId.toString() === team.team_id)!.points}</td>
      </tr>
    )
  })

  return (
    <div>
      <h2>Week: {league.current_week}</h2>
      <table className="table-auto">
        <thead>
          <tr>
            <th></th>
            <th>Scored</th>
            <th>Projected</th>
          </tr>
        </thead>
        <tbody>
          {tableData}
        </tbody>
      </table>
    </div>
  );
}

function LoadError() {
  return <div><h2>Failed to load data</h2></div>
}