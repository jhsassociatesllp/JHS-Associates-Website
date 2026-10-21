import { expertsData } from './expertsData'
import type { ExpertRow } from './expertsData'

// Maps each service-page bullet point (by page id + point id) to the matching row(s)
// in the JHS Mumbai Service Capability sheet (see expertsData.ts). Curated by hand —
// point wording on the marketing pages does not always match the sheet 1:1, so a point
// with no confident match is simply left out here and the ExpertsModal shows a
// "speak to our team" fallback instead of guessing.
export const serviceExpertsMap: Record<string, Record<string, number[]>> = {
  assurance: {
    '01': [3],
    '02': [8],
    '03': [2, 32],
    '04': [15, 16],
    '05': [7],
    '07': [15, 63],
    '08': [34, 84, 85],
    '09': [11],
    '10': [4, 5, 86],
    '11': [3, 67, 68],
    '12': [37],
  },
  consulting: {
    '01': [21, 83],
    '02': [32, 17, 29],
    '03': [12, 34],
    '04': [82, 7],
    '05': [35, 88],
    '06': [78],
    '07': [50, 84, 85],
    '08': [36],
    '09': [48, 22],
    '11': [82],
    '12': [86, 82],
  },
  taxation: {
    '01': [10],
    '02': [9],
    '03': [22],
    '04': [9],
    '05': [22, 9],
    '06': [69, 9],
    '08': [10],
    '09': [10],
    '10': [8],
    '11': [26, 27],
    '12': [8, 25],
  },
  outsourcing: {
    '01': [13],
    '02': [87],
    '03': [1],
    '04': [33, 77],
    '05': [22],
    '06': [7, 24],
    '07': [7, 14],
    '09': [1, 24],
    '11': [50],
    '12': [12, 49],
  },
  'corporate-finance': {
    '02': [62],
    '03': [82],
    '05': [84, 85, 82],
  },
  'learning-development': {
    '01': [77],
    '02': [77],
    '03': [77],
    '04': [77],
    '05': [77],
    '06': [77],
    '07': [77],
    '08': [33],
    '09': [77],
    '10': [77],
    '11': [77],
    '12': [77],
  },
  'compliance-learning': {
    '01': [51],
    '02': [47],
    '03': [12],
    '04': [44, 51],
    '05': [45, 35],
    '06': [21, 83],
    '07': [31],
    '08': [48, 22],
    '09': [31],
    '10': [10],
    '11': [36, 49],
  },
}

const bySno = new Map(expertsData.map((row) => [row.sno, row]))

export function getExpertsForPoint(pageId: string, pointId: string): ExpertRow[] {
  const snos = serviceExpertsMap[pageId]?.[pointId] ?? []
  return snos.map((sno) => bySno.get(sno)).filter((row): row is ExpertRow => Boolean(row))
}
