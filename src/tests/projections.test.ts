import { getNFLScoreboard } from "@/apis/espn";
import { getTeamsWithPlayers } from "@/apis/yahoo";
import { getAllLeagueProjections } from "@/stats/projections";
import { getAllPlayerProjections, SleeperPlayer } from "@/apis/sleeper";

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
    "4": { // 6.8
      player_id: "4",
      number: 4,
      full_name: "Some Guy",
      team: "",
      fantasy_positions: ["PIT"]
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

const mockPlayerProjections = {
  "1": { // 10
    "pass_td": 2.5
  },
  "2": { // 11.4
    "rush_yds": 66,
    "rush_tds": 0.8
  },
  "CIN": { // 4.8
    "sack": 3.2,
    "int": 0.8
  },
  "4": { // 6.8
    "xpmiss": 0.1,
    "fgm_yds": 78
  }
}

const mockTeamsAndPlayers = {
  teams: [
    {
      team: {
        team_id: 1,
        players: [
          {
            player: {
              player_id: 11,
              name: {
                full: 'Joe Burrow'
              },
              editorial_team_abbr: 'Cin',
              primary_position: 'QB',
              uniform_number: "1"
            }
          },
          {
            player: {
              player_id: 12,
              name: {
                full: 'Some Guy'
              },
              editorial_team_abbr: 'Pit',
              primary_position: 'K',
              uniform_number: "4"
            }
          },
        ]
      }
    },
    {
      team: {
        team_id: 2,
        players: [
          {
            player: {
              player_id: 13,
              name: {
                full: 'Nick Chubb'
              },
              editorial_team_abbr: 'Cle',
              primary_position: 'RB',
              uniform_number: "2"
            }
          },
          {
            player: {
              player_id: 14,
              name: {
                full: 'Cinncinatti'
              },
              editorial_team_abbr: 'Cin',
              primary_position: 'DEF',
              uniform_number: null
            }
          },
        ]
      }
    }
  ]
}

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
    expect(Math.round(projectedScores.find(t => t.teamId === 1)?.points!)).toBeCloseTo(45.6 + 6.8 + 2.666666);
    expect(Math.round(projectedScores.find(t => t.teamId === 2)?.points!)).toBeCloseTo(78 + 3.03999 + 1.2799999);
  });
});