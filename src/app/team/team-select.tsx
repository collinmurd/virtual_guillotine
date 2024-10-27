'use client'

import { useRouter } from "next/navigation";

interface TeamSelectProps {
  teams: {name: string, id: string}[],
  defaultId: string | null,
  compare?: boolean,
  defaultCompareId?: string,
}
export function TeamSelect(props: TeamSelectProps) {
  const router = useRouter();

  const options = props.teams.map(t => {
    return <option key={t.id} value={t.id} className="text-black">{t.name}</option>
  });

  return (
    <form>
      <div className="flex">
        <select
          defaultValue={props.defaultId || '1'}
          onChange={(e) => router.replace(queryString(e.target.value, props.defaultCompareId))}
          className={"bg-transparent border border-white mx-1" + (props.compare ? " w-6/12" : "")}
        >
          {options}
        </select>
        {props.compare && 
          <select
            defaultValue={props.defaultCompareId || '1'}
            onChange={(e) => router.replace(queryString(props.defaultId || '1', e.target.value))}
            className={"bg-transparent border border-white mx-1" + (props.compare ? " w-6/12" : "")}
          >
            {options}
          </select>
        }
      </div>
    </form>
  );
}

function queryString(teamId: string, compareTeamId?: string) {
  if (compareTeamId) {
    return `?team=${teamId}&compare=${compareTeamId}`;
  }

  return `?team=${teamId}`;
}