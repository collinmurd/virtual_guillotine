'use client'

export function TeamSelect(props: {teams: {name: string, id: string}[]}) {
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
