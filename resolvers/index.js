import getContributorFeed from './getContributorFeed'
import getFinanceInfo from './getFinanceInfo'
import testFacebookMessenger from './testFacebookMessenger'

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getContributorFeed,
    getFinanceInfo,
    testFacebookMessenger,
  },
}
