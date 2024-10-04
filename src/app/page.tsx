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

  const leagueProjections = await proj.getAllLeagueProjections(
    league.current_week,
    leagueStats.map(team => {return {teamId: parseInt(team.team_id), points: parseFloat(team.team_points!.total)}})
  ).catch(e => {
    console.log(e);
    return null;
  });

  if (!leagueProjections) {
    return LoadError();
  }

  const tableData = leagueStats.map(team => {
    return (
      <tr key={team.team_id}>
        <th scope="row">{team.name}</th>
        <td>{team.team_points!.total}</td>
        <td>{leagueProjections.find(t => t.teamId.toString() === team.team_id)!.points}</td>
      </tr>
    )
  })

  return (
    <div>
      <h2>Week: {league.current_week}</h2>
      <table>
        <thead>
          <tr>
            <th>Manager</th>
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