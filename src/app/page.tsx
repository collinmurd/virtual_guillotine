import { getLeague, getLeagueStatsForWeek } from "@/yahooApi";

export default async function Scoreboard() {
  const leagueStats = await getLeagueStatsForWeek();

  const tableData = leagueStats.teams.map((team: any) => {
    return (
      <tr>
        <th scope="row">{team.name}</th>
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
