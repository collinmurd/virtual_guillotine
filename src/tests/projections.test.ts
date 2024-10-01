import { getNFLScoreboard } from "@/apis/espn";
import { getTeamsWithPlayers, YahooTeam } from "@/apis/yahoo";
import { getAllLeagueProjections } from "@/stats/projections";
import { getAllPlayerProjections, SleeperPlayer } from "@/apis/sleeper";
import playerMap from '../apis/sleeperPlayerMap';

jest.mock('../apis/espn');
jest.mock('../apis/sleeper');
jest.mock('../apis/yahoo');
jest.mock('../apis/sleeperPlayerMap', (): { [player_id: string]: SleeperPlayer } => {
  return {
    "1": { // rem. proj = 2.66666
      player_id: "1",
      number: 1,
      full_name: "Joe Burrow",
      team: "CIN",
      fantasy_positions: ["QB"]
    },
    "2": { // 3.03999
      player_id: "2",
      number: 2,
      full_name: "Nick Chubb",
      team: "CLE",
      fantasy_positions: ["RB"]
    },
    "CIN": { // 1.2799999
      player_id: "CIN",
      full_name: undefined,
      number: undefined,
      team: "CIN",
      fantasy_positions: ["DEF"]
    },
    "4": { // 7.7
      player_id: "4",
      number: 4,
      full_name: "Some Guy",
      team: "PIT",
      fantasy_positions: ["K"]
    }
  };
});

const mockGames = {
  events: [
    {
      shortName: 'CIN @ CLE',
      competitions: [
        {
          status: {
            clock: 60.0,
            period: 3 // 960 to go in the game - 0.2666666
          }
        }
      ]
    },
    {
      shortName: 'PIT @ BAL',
      competitions: [
        {
          status: {
            clock: 900.0,
            period: 1
          }
        }
      ]
    },
  ]
};

const projections: {[id: string]: any} = {
  "1": { // 10
    "pass_td": 2.5
  },
  "2": { // 11.4
    "rush_yd": 66,
    "rush_td": 0.8,
    "adp_dd_ppr": 1.3 // not in our stat map. should ignore
  },
  "CIN": { // 4.8
    "sack": 3.2,
    "int": 0.8
  },
  "4": { // 7.7
    "xpmiss": 0.1,
    "fgm_yds": 78
  }
}

const mockPlayerProjections: SleeperPlayer[] = Object.entries(playerMap).map(entry => {
  return {
    ...entry[1],
    projections: projections[entry[0]]
  }
});

const mockTeamsAndPlayers: YahooTeam[] = [
  {
    team_id: "1",
    name: "team1",
    players: [
      {
        player: {
          player_id: '11',
          name: {
            full: 'Joe Burrow',
            first: 'Joe',
            last: 'Burrow'
          },
          editorial_team_abbr: 'Cin',
          primary_position: 'QB',
          uniform_number: "1",
          by_weeks: [{week: '10'}]
        }
      },
      {
        player: {
          player_id: "12",
          name: {
            full: 'Some Guy',
            first: 'Some',
            last: 'Guy'
          },
          editorial_team_abbr: 'Pit',
          primary_position: 'K',
          uniform_number: "4",
          by_weeks: [{week: '11'}]
        }
      },
    ]
  },
  {
    team_id: '2',
    name: 'team2',
    players: [
      {
        player: {
          player_id: '13',
          name: {
            full: 'Nick Chubb',
            first: 'Nick',
            last: 'Chubb'
          },
          editorial_team_abbr: 'Cle',
          primary_position: 'RB',
          uniform_number: "2",
          by_weeks: [{week: '13'}]
        }
      },
      {
        player: {
          player_id: '14',
          name: {
            full: 'Cincinnati',
            first: 'Cincinnati',
            last: null
          },
          editorial_team_abbr: 'Cin',
          primary_position: 'DEF',
          uniform_number: null,
          by_weeks: [{week: '8'}]
        }
      },
    ]
  }
];

const mockCurrentScores = [
  {
    teamId: 1,
    points: 45.6
  },
  {
    teamId: 2,
    points: 78
  }
]

describe('calculateTeamProjections', () => {
  beforeEach(() => {
    (getNFLScoreboard as jest.Mock).mockReturnValue(mockGames);
    (getAllPlayerProjections as jest.Mock).mockReturnValue(mockPlayerProjections);
    (getTeamsWithPlayers as jest.Mock).mockReturnValue(mockTeamsAndPlayers);
  });

  it('should return a list with current projections', async () => {
    const projectedScores = await getAllLeagueProjections(1, mockCurrentScores);

    expect(projectedScores).toHaveLength(2);
    expect(projectedScores.find(t => t.teamId === 1)?.points!).toBeCloseTo(45.6 + 7.7 + 2.666666);
    expect(projectedScores.find(t => t.teamId === 2)?.points!).toBeCloseTo(78 + 3.03999 + 1.2799999);
  });
});