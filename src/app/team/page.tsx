import * as yahoo from "@/apis/yahoo"
import { getSession } from "@/session";
import LoadError from "@/shared-components/load-error";
import { getTeamProjections } from "@/stats/projections";

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
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (!(await getSession())) {
    return <></>
  }

  let teamId = searchParams['team'];
  if (!teamId || typeof teamId != "number") {
    teamId = "1"; // kind of hacky, default to the team with id 1
  }

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

  const playerScores = await getTeamProjections(league.current_week, parseInt(teamId));

  const teamSelectData = teams.map(t => {
    return {
      name: t.name,
      id: t.team_id
    }
  });

  return (
    <div>
      <div className="flex justify-center">
        <TeamSelect teams={teamSelectData}/>
      </div>
      <Lineup />
    </div>
  )
}

function TeamSelect(props: {teams: {name: string, id: string}[]}) {
  const options = props.teams.map(t => {
    return <option key={t.id} value={t.id} className="text-black">{t.name}</option>
  });

  return (
    <form>
      <select className="bg-transparent border border-white">
        {options}
      </select>
    </form>
  )
}

function Lineup() {
  const rows = positions.map((p, i) =>
    <tr key={p + i}>
      <th scope="row">{p}</th>
      <td>Player Name</td>
      <td><p>10.43</p><p className="text-xs">12.3</p></td>
    </tr>
  )
  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}