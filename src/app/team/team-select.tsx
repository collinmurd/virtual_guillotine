'use client'

import { useRouter } from "next/navigation";

export function TeamSelect(props: {teams: {name: string, id: string}[], defaultId: string | null}) {
  const router = useRouter();

  const options = props.teams.map(t => {
    return <option key={t.id} value={t.id} className="text-black">{t.name}</option>
  });

  return (
    <form>
      <select
        defaultValue={props.defaultId || '1'}
        onChange={(e) => router.replace(`/team?team=${e.target.value}`)}
        className="bg-transparent border border-white"
      >
        {options}
      </select>
    </form>
  );
}
