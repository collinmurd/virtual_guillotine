'use client'

import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";
import React, { useState } from "react";

export interface ScoresTableData {
  teamId: string,
  manager: string,
  score: number,
  projectedScore: number
}

type SortableKey = 'score' | 'projectedScore'
const headerKeyMap = {
  'score': 'Score',
  'projectedScore': 'Proj'
}
type SortStatus = {key: SortableKey, desc: boolean}

export function ScoresTable(props: {data: ScoresTableData[]}) {
  const [currentSort, setCurrentSort] = useState<SortStatus>({key: 'score', desc: true})

  function sort(data: ScoresTableData[], key: SortableKey, desc: boolean = true) {
    data.sort((a, b) => {
      if (desc) {
        return b[key] - a[key];
      } else {
        return a[key] - b[key];
      }
    });

    return data;
  }

  function handleSortClicked(key: SortableKey) {
    setCurrentSort({
      key: key,
      desc: currentSort.key === key ? !currentSort.desc : true
    });
  }

  const sortHeaders = Object.entries(headerKeyMap).map(([key, column]) => {
    return (
      <TableCell key={key} header>
        <div className="flex">
          <button onClick={() => handleSortClicked(key as SortableKey)}>{column}</button>
          <IconCaretUpFilled className={currentSort.key === key && !currentSort.desc ? '' : 'hidden'}/>
          <IconCaretDownFilled className={currentSort.key === key && currentSort.desc ? '' : 'hidden'}/>
        </div>
      </TableCell>
    );
  });

  const tableContents = sort(props.data, currentSort.key, currentSort.desc).map(row => {
    return (
      <tr key={row.teamId}>
        <TableCell header extraClasses="flex flex-row-reverse">{row.manager}</TableCell>
        <TableCell header={false}>{row.score}</TableCell>
        <TableCell header={false}>{row.projectedScore}</TableCell>
        <TableCell header={false}></TableCell>
      </tr>
    )
  });

  return (
    <div>
      <table className="table-fixed mt-1">
        <thead>
          <tr>
            <th></th>
            {sortHeaders}
            <TableCell header>P/YTP</TableCell>
          </tr>
        </thead>
        <tbody>
          {tableContents}
        </tbody>
      </table>
    </div>
  );
}

function TableCell(props: {children?: React.ReactNode, header: boolean, extraClasses?: string}) {
  if (props.header) {
    return (
      <th className={(props.extraClasses || '') + " min-w-24 border border-lime-400 px-3"}>{props.children}</th>
    );
  } else {
    return (
      <td className={(props.extraClasses || '') + " min-w-24 border border-lime-400 px-3"}>{props.children}</td>
    );
  }
}
