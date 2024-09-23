
export interface Stat {
  yahoo_id: number,
  sleeper_name: string,
  weight: number
}

export const stats: {[yahoo_id: string]: Stat} = {
  'pass_yd': {
    yahoo_id: 4,
    sleeper_name: 'pass_yd',
    weight: 0.04
  },
  'pass_td': {
    yahoo_id: 5,
    sleeper_name: 'pass_td',
    weight: 4
  },
  'pass_int': {
    yahoo_id: 6,
    sleeper_name: 'pass_int',
    weight: -2
  },
  'rush_yd': {
    yahoo_id: 9,
    sleeper_name: 'rush_yd',
    weight: 0.1
  },
  'rush_td': {
    yahoo_id: 10,
    sleeper_name: 'rush_td',
    weight: 6
  },
  'rec': {
    yahoo_id: 11,
    sleeper_name: 'rec',
    weight: 1
  },
  'rec_yd': {
    yahoo_id: 12,
    sleeper_name: 'rec_yd',
    weight: 0.1
  },
  'rec_td': {
    yahoo_id: 13,
    sleeper_name: 'rec_td',
    weight: 6
  },
  'pr_td': {
    yahoo_id: 15,
    sleeper_name: 'pr_td',
    weight: 6
  },
  'kr_td': {
    yahoo_id: 15,
    sleeper_name: 'kr_td',
    weight: 6
  },
  'rush_2pt': {
    yahoo_id: 16,
    sleeper_name: 'rush_2pt',
    weight: 2
  },
  'pass_2pt': {
    yahoo_id: 16,
    sleeper_name: 'pass_2pt',
    weight: 2
  },
  'fum_lost': {
    yahoo_id: 18,
    sleeper_name: 'fum_lost',
    weight: -2
  },
  'fgmiss_0_19': {
    yahoo_id: 24,
    sleeper_name: 'fgmiss_0_19',
    weight: -1
  },
  'fgmiss_20_29': {
    yahoo_id: 25,
    sleeper_name: 'fgmiss_20_29',
    weight: -1
  },
  'fgmiss_30_39': {
    yahoo_id: 26,
    sleeper_name: 'fgmiss_30_39',
    weight: -1
  },
  'fgmiss_40_49': {
    yahoo_id: 27,
    sleeper_name: 'fgmiss_40_49',
    weight: -1
  },
  'fgmiss_50p': {
    yahoo_id: 28,
    sleeper_name: 'fgmiss_50p',
    weight: -1
  },
  'xpm': {
    yahoo_id: 29,
    sleeper_name: 'xpm',
    weight: 1
  },
  'xpmiss': {
    yahoo_id: 30,
    sleeper_name: 'xpmiss',
    weight: -1
  },
  'fgm_yds': {
    yahoo_id: 84,
    sleeper_name: 'fgm_yds',
    weight: 0.1
  },
  'sack': {
    yahoo_id: 32,
    sleeper_name: 'sack',
    weight: 1
  },
  'int': {
    yahoo_id: 33,
    sleeper_name: 'int',
    weight: 2
  },
  'fum_rec': {
    yahoo_id: 34,
    sleeper_name: 'fum_rec',
    weight: 2
  },
  'def_td': {
    yahoo_id: 35,
    sleeper_name: 'def_td',
    weight: 6
  },
  'safe': {
    yahoo_id: 36,
    sleeper_name: 'safe',
    weight: 4
  },
  'blk_kick': {
    yahoo_id: 37,
    sleeper_name: 'blk_kick',
    weight: 2
  },
  'st_td': { // Kickoff and Punt Return touchdowns
    yahoo_id: 49,
    sleeper_name: 'st_td',
    weight: 6
  },
  'pts_allow_28_34': {
    yahoo_id: 55,
    sleeper_name: 'pts_allow_28_34',
    weight: -1
  },
  'pts_allow_35p': {
    yahoo_id: 56,
    sleeper_name: 'pts_allow_35p',
    weight: -4
  },
  'def_4_and_stop': {
    yahoo_id: 67,
    sleeper_name: 'def_4_and_stop', // TODO: confirm this
    weight: 1
  },
  'tkl_loss': {
    yahoo_id: 68,
    sleeper_name: 'tkl_loss',
    weight: 0.25
  },
  'yds_allow_300_349': {
    yahoo_id: 74,
    sleeper_name: 'yds_allow_300_349',
    weight: -1
  },
  'yds_allow_350_399': {
    yahoo_id: 74,
    sleeper_name: 'yds_allow_350_399',
    weight: -1
  },
  'yds_allow_400_449': {
    yahoo_id: 75,
    sleeper_name: 'yds_allow_400_449',
    weight: -3
  },
  'yds_allow_450_499': {
    yahoo_id: 75,
    sleeper_name: 'yds_allow_450_499',
    weight: -3
  },
  'yds_allow_500p': {
    yahoo_id: 76,
    sleeper_name: 'yds_allow_500p', // TODO: confirm this,
    weight: -5
  },
  'def_3_and_out': {
    yahoo_id: 77,
    sleeper_name: 'def_3_and_out',
    weight: 0.5
  }
}