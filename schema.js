
const schema = `
type Contributor {   
  name: String!
  location: String!
}

type FinanceInfo {
  netWorth: Int!
  amountToSave: Int!
  canSpend: Int!
  compareMonth: String!
}

#returns list of contributors
type Query {
  getContributorFeed : [Contributor]
  getFinanceInfo(
    huntington: Int!,
    misc: Int,
    discover: Int,
    month: Int,
    year: Int
  ): FinanceInfo
}

`

// eslint-disable-next-line import/prefer-default-export
export { schema }
