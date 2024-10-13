
export default function Page() {
  return (
    <div>
      <TeamSelect />
    </div>
  )
}

function TeamSelect() {
  return (
    <form>
      <select>
        <option value="Team A">Team A</option>
        <option value="Team B">Team B</option>
      </select>
    </form>
  )
}