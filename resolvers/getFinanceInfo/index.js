import moment from 'moment'
import {
  income,
  savingParams,
} from './seed-data-financials'

// Returns debit - credit
function getNetWorth({ huntington, discover = 0, misc = 0 }) {
  const debit = huntington + misc
  return debit - discover
}

// Gets reference point date
function getCompareDate(month, year) {
  // Get next month if month not specified
  if (!month && month !== 0) {
    return moment().date(1).add(1, 'month')
  }

  // Set compare month & year
  return year
    ? moment().year(year).month(month)
    : moment().month(month)
}

function calculateSavings({ compareDate, saveTotal, startSaving, durationMonths }) {
  const startMonthDiff = compareDate.diff(startSaving, 'months') // rounds down positive
  const monthlySave = saveTotal / durationMonths

  // Escape if saving period has not started yet or if past duration
  if (startMonthDiff < 0 || startMonthDiff > durationMonths) {
    return durationMonths * monthlySave
  }

  return startMonthDiff * monthlySave
}

function getMonthCanSpend({ compareDate, netWorth, amountToSave, income }) {
  // Get diff between
  // const compareDateDiff = compareDate.diff(moment(), 'months')
  // console.log('compareDateDiff', compareDateDiff)
  return netWorth - amountToSave
}

export default function getFinanceInfo(obj, args) {
  const {
    month,
    year,
  } = args

  // Calculate net worth
  const netWorth = getNetWorth(args)

  // Get date anchors for comparison
  const compareDate = getCompareDate(month, year)

  // Run through all amount saved functions
  let amountToSave = 0
  savingParams.forEach(save => {
    amountToSave += calculateSavings({ compareDate, ...save })
  })
  amountToSave = Math.round(amountToSave)

  // Estimate spend for month
  const canSpend = getMonthCanSpend({ compareDate, netWorth, amountToSave, income })

  return {
    netWorth,
    amountToSave,
    canSpend,
    compareMonth: compareDate.format('MMMM YYYY'),
    daysLeft: compareDate.diff(moment(), 'days'),
    savingFor: savingParams.map(({ name }) => name),
  }
}
