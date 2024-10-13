import * as yahoo from "@/apis/yahoo"
import { getSession } from "@/session";
import LoadError from "@/shared-components/load-error";

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

export default async function Page() {
  if (!(await getSession())) {
    return <></>
  }

  const teams = await yahoo.getTeamsWithPlayers();

  if (!teams) {
    return LoadError();
  }

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
      <td>10.43</td>
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