import moment from 'moment'

// TODO: Get from DB
const SAVING_PARAMS = [
  {
    name: 'Taxes 2017',
    perMonth: '400',
    startSaving: moment().dayOfYear(1),
    endSaving: moment().dayOfYear(365),
  },
]

// Returns debit - credit
function getNetWorth({ huntington, discover = 0, misc = 0 }) {
  return huntington + misc - discover
}

// Gets reference point date
function getCompareDate(month, year) {
  // Get next month if month not specified
  if(!month && !month == 0) {
    return moment().add(1, 'month')
  }
  else {
    // Init compare month
    let compareDate = moment().month(month)

    // Assumes this year if year not specified
    if(year) {
      compareDate.setYear(year)
    }
    return compareDate
  }
}

function calculateSavings({ compareDate, perMonth, startSaving, endSaving }) {
  const startMonthDiff = compareDate.diff(startSaving, 'months') // rounds down positive
  const endMonthDiff = compareDate.diff(endSaving, 'months')
  
  // If negative, saving period has not started yet
  if(startMonthDiff < 0) {
    return 0
  }

  // Compare date is during or before endMonth
  const multiplier = endMonthDiff < 0
    ? startMonthDiff
    : startMonthDiff - endMonthDiff

  return multiplier * perMonth
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
  const savingParams = SAVING_PARAMS

  let amountToSave = 0
  for(let save of savingParams) {
    amountToSave += calculateSavings({ compareDate, ...save })
  }

  return {
    netWorth,
    amountToSave,
  }
}
