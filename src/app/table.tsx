'use client'

export interface ScoresTableData {
  teamId: string,
  manager: string,
  score: number,
  projectedScore: number
}

export function ScoresTable(props: {data: ScoresTableData[]}) {
  const tableContents = props.data.map(row => {
    return (
      <tr key={row.teamId}>
        <TableCell header extraClasses="flex flex-row-reverse">{row.manager}</TableCell>
        <TableCell header={false}>{row.score}</TableCell>
        <TableCell header={false}>{row.projectedScore}</TableCell>
      </tr>
    )
  })

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th></th>
          <TableCell header>Scored</TableCell>
          <TableCell header>Projected</TableCell>
        </tr>
      </thead>
      <tbody>
        {tableContents}
      </tbody>
    </table>
  );
}

function TableCell(props: {children: React.ReactNode, header: boolean, extraClasses?: string}) {
  if (props.header) {
    return (
      <th className={props.extraClasses + " border border-lime-400 px-3"}>{props.children}</th>
    );
  } else {
    return (
      <td className={props.extraClasses + " border border-lime-400 px-3"}>{props.children}</td>
    );
  }
}
