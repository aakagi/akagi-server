import moment from 'moment'

// TODO: Get from DB
const SAVING_PARAMS = [
  {
    name: 'Taxes 2017',
    saveTotal: 5000,
    startSaving: moment().dayOfYear(1),
    durationMonths: 12,
  },
  {
    name: 'Burning Man 2018',
    saveTotal: 2000,
    startSaving: moment('2017-09-01'),
    durationMonths: 12,
  },
  {
    name: 'Snowboard',
    saveTotal: 300,
    startSaving: moment('2017-10-01'),
    durationMonths: 4,
  },
]

// Returns debit - credit
function getNetWorth({ huntington, discover = 0, misc = 0 }) {
  const debit = huntington + misc
  return debit - discover
}

// Gets reference point date
function getCompareDate(month, year) {
  // Get next month if month not specified
  if (!month && month !== 0) {
    return moment().add(1, 'month')
  }

  // Set compare month & year
  return year
    ? moment().year(year).month(month)
    : moment().month(month)
}

function calculateSavings({ compareDate, saveTotal, startSaving, durationMonths }) {
  const startMonthDiff = compareDate.diff(startSaving, 'months') // rounds down positive
  const montlySave = saveTotal / durationMonths

  // Escape if saving period has not started yet or if past duration
  if (startMonthDiff < 0 || startMonthDiff > durationMonths) {
    return 0
  }

  return startMonthDiff * montlySave
}

function getMonthCanSpend({ compareDate, netWorth, amountToSave }) {
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
  const savingParams = SAVING_PARAMS
  let amountToSave = 0
  savingParams.forEach(save => {
    amountToSave += calculateSavings({ compareDate, ...save })
  })
  amountToSave = Math.round(amountToSave)
  
  // Estimate spend for month
  const canSpend = getMonthCanSpend({ compareDate, netWorth, amountToSave })

  return {
    netWorth,
    amountToSave,
    canSpend,
    compareMonth: compareDate.format('MMMM YYYY')
  }
}
