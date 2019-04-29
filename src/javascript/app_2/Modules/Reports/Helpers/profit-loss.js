export const isProfitOrLoss = value => +value.replace(/,/g, '') >= 0 ? 'profit' : 'loss';
