import { getLeagueStatsForWeek } from "@/apis/yahoo";
import { getSession } from "@/session";
import { cookies } from "next/headers";

export default async function Scoreboard() {
  if (!(await getSession(cookies()))) {
    return <></>
  }

  const leagueStats = await getLeagueStatsForWeek();
  const tableData = leagueStats.teams.map((team: any) => {
    return (
      <tr key={team.team.team_id}>
        <th scope="row">{team.team.name}</th>
        <td>{team.team.team_points.total}</td>
        <td></td>
      </tr>
    )
  })

  return (
    <div>
      <h2>Week: {leagueStats.current_week}</h2>
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
