var KnowledgeTestData = (function() {
    "use strict";
    var questions = {
        section1:[
            {
                question: "{JAPAN ONLY}An option holder must buy ( or sell ) the underlying asset at a predetermined price within a specified period ( or at a specific time ).",
                answer: false,
                id: 1,
            },
            {
                question: "{JAPAN ONLY}A Currency Option confers the right to sell one currency in exchange for another currency as the underlying asset. For example, the right to sell Yen and buy Dollars is known as a Yen Put / Dollar Call Option, or just Yen Put for short; and the opposite right to buy Yen and sell Dollar is called a Yen Call / Dollar Put Option, or just Yen Call for short.",
                answer: true,
                id: 2
            },
            {
                question: "{JAPAN ONLY}There are two types of option delivery: One requires exchanging the underlying asset, and the other requires a payment which depends on the difference between the fair market price and the exercise price. A Binary Option is the second type where if the fair market price meets certain conditions with respect to the exercise price, then an agreed fixed amount will be paid to the option buyer.",
                answer: true,
                id: 3
            },
            {
                question: "{JAPAN ONLY}A  Net Settlement type of option is one where the underlying asset does not include yen, but the option fee and settlement are paid in yen; it therefore requires some definition of how the settlement amounts will be calculated and converted to yen.",
                answer: true,
                id: 4
            },
            {
                question: "{JAPAN ONLY}A Binary Option contains the right for the buyer to receive a certain fixed amount if the market price reaches the exercise price by the exercise time, but it does not contain any rights to sell or buy the underlying asset.",
                answer: true,
                id: 5
            },
            {
                question: "{JAPAN ONLY}There are some types of Binary Option, such as Range Binary Options, Touch or No-Touch Binary Options, that are exceptions to the general rule where payment is made at a known exercise time. For these types of option a payment is made automatically at Exit Time when certain conditions have been met.",
                answer: true,
                id: 6
            },
            {
                question: "{JAPAN ONLY}There are many types of Binary Option, including some such as Range Binary Options and Touch or No-Touch Binary Options which do not always require automatic payment at Exercise Time and which will be settled earlier if certain conditions have been met. However, in all cases, for a payment to be required, the option must end In The Money.",
                answer: true,
                id: 7
            },
            {
                question: "{JAPAN ONLY}A Currency Binary Option is one where there is a target for a particular currency pair, so a strike price for the exchange rate is agreed, and a payout will be due if the judgment price meets the conditions of being over or under the target strike price, depending on the option type, by the exercise time.",
                answer: true,
                id: 8
            },
            {
                question: "{JAPAN ONLY}For a currency binary option which has the underlying exchange rate of dollars against yen, the right to receive a payout if the yen becomes weaker is known as a dollar-put binary option.",
                answer: false,
                id: 9
            },
            {
                question: "{JAPAN ONLY}For a currency binary option with the underlying exchange rate of dollars against yen, the right to receive a payout if the yen becomes stronger is known as a dollar-put binary option.",
                answer: true,
                id: 10
            },
            {
                question: "{JAPAN ONLY}If you sell a currency binary call option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will need to payout 1,000 yen to the buyer of the option.",
                answer: false,
                id: 11
            },
            {
                question: "{JAPAN ONLY}If you sell a currency binary put option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will need to payout 1,000 yen to the buyer of the option.",
                answer: true,
                id: 12
            },
            {
                question: "{JAPAN ONLY}If you buy a currency binary call option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will receive a payout 1,000 yen from the seller of the option.",
                answer: false,
                id: 13
            },
            {
                question: "{JAPAN ONLY}If you buy a currency binary put option at a price of 500 yen, with an underlying of dollar against yen, the payout is 1,000 yen, and the strike price is 100, then if the judgment price at exercise time is 99, you will receive a payout 1,000 yen from the seller of the option.",
                answer: true,
                id: 14
            },
            {
                question: "{JAPAN ONLY}If you buy a currency binary option at a price of 500 yen, and the judgment price meets the conditions so you receive a payout of 1,000 yen, then your profit can be calculated 500 yen after subtracting the 500 yen that was paid as a fee to the option seller.",
                answer: true,
                id: 15
            },
            {
                question: "{JAPAN ONLY}If you sell a currency binary option at a price of 500 yen, and the judgment price meets the conditions so you need to payout 1,000 yen, then your profit will be minus 500 yen after subtracting the 500 yen that was received as a fee from the option buyer.",
                answer: true,
                id: 16
            }
        ],
        section2:[
            {
                question: "{JAPAN ONLY}To avoid or hedge the future price of an underlying asset which you hold, you should buy a call option.",
                answer: false,
                id: 17
            },
            {
                question: "{JAPAN ONLY}To compensate for any rise in the price of an underlying asset that you intend to buy in future, you should buy a call option.",
                answer: true, id: 18
            },
            {
                question: "{JAPAN ONLY}If you believe the underlying asset price will move by a large amount in either direction, you can benefit by buying both a call and a put option, with the exercise prices set above and below the current underlying price.",
                answer: true, id: 19
            },
            {
                question: "{JAPAN ONLY}If you believe the underlying asset price will be only moderately volatile, you could still benefit by buying both a call and put option with exercise prices that are above and below the exercise price.",
                answer: true, id: 20
            },
            {
                question: "{JAPAN ONLY}A Covered option position is where you hold an offsetting position in the underlying asset.",
                answer: true,
                id: 21,
            },
            {
                question: "{JAPAN ONLY}A binary call option buyer will benefit from a correct prediction that the asset price will decline to below the strike price by the judgment time.",
                answer: false,
                id: 22
            },
            {
                question: "{JAPAN ONLY}A binary put option buyer will benefit from a correct prediction that the asset price will decline to below the strike price by the judgment time.",
                answer: false,
                id: 23
            },
            {
                question: "{JAPAN ONLY}A binary put options buyer will benefit from a correct prediction that the asset price will rise above the strike price by the judgment time.",
                answer: false,
                id: 24
            },
            {
                question: "{JAPAN ONLY}A binary call options buyer will benefit from a correct prediction that the asset price will rise above the strike price by the judgment time.",
                answer: true,
                id: 25
            },
            {
                question: "{JAPAN ONLY}When buying a vanilla call option, the break-even price at the exercise point is the strike price plus the option price paid in units of the underlying.",
                answer: true,
                id: 26
            },
            {
                question: "{JAPAN ONLY}When buying a vanilla put option, the break-even price at the exercise point is the strike price minus the option price paid in units of the underlying.",
                answer: true,
                id: 27
            },
            {
                question: "{JAPAN ONLY}Using binary options for hedging a position in the underlying asset means that only part of the loss or gain can be hedged, because the payout amount is fixed.",
                answer: true,
                id: 28
            },
            {
                question: "{JAPAN ONLY}It is possible to use two binary options to make a profit if the asset price settles inbetween the two strikes. It is also possible to buy a single range option that will achieve the same result.",
                answer: true,
                id: 29
            },
            {
                question: "{JAPAN ONLY}It is possible to use two binary options to make a profit if the asset price settles outside the two strikes. It is also possible to buy a single range option that will achieve the same result.",
                answer: true,
                id: 30
            },

        ],
        section3:[
            {
                question: "{JAPAN ONLY}In Japan there are defined trading periods for binary options must be 2 hours or longer, and all trades must be conducted at the start of each trading period.",
                answer: false,
                id: 31
            },
            {
                question: "{JAPAN ONLY}A bought or sold binary option may be closed-out before exercise time by selling or buying-back the option, or alternatively by cancelling.",
                answer: true,
                id: 32
            },
            {
                question: "{JAPAN ONLY}In contrast to other types of FX options, short positions in FX Binary Options cannot be closed-out as they are not subject to loss-cut regulations.",
                answer: false,
                id: 33
            },
            {
                question: "{JAPAN ONLY}Short positions in FX Binary Options must be covered by initial margin and any further losses must be covered by further margin deposits.",
                answer: true,
                id: 34
            },
            {
                question: "{JAPAN ONLY}Although customers and brokers will set limits on customers trading losses, even if those losses are exceeded, it is the customer's responsibility to close the position and so mandatory loss-cuts will not be executed by the broker company.",
                answer: false,
                id: 35
            },
            {
                question: "{JAPAN ONLY}Options may be European or American style of exercise, and those which can be exercised at only one expiry time are the European style options.",
                answer: true,
                id: 36
            },
            {
                question: "{JAPAN ONLY}For a call option, if the price of the underlying asset is higher than the option exercise price, it is know as an in-the-money option.",
                answer: true,
                id: 37
            },
            {
                question: "{JAPAN ONLY}For a call option, if the price of the underlying asset is higher than the option exercise price, it is know as an out-of-the-money option.",
                answer: false,
                id: 38
            },
            {
                question: "{JAPAN ONLY}For both call and put options, if the underlying asset price is the same as the exercise price, it is known as an at-the-money option.",
                answer: true,
                id: 39
            },
            {
                question: "{JAPAN ONLY}For a put option, if the underlying asset price is lower than the option exercise price, it is known as an out-of-the-money option.",
                answer: false,
                id: 40
            },
            {
                question: "{JAPAN ONLY}For a put option, if the underlying asset price is higher than the option exercise price, it is known as an in-the-money option.",
                answer: false,
                id: 41,
            },
            {
                question: "{JAPAN ONLY}The Exercise Price is the level at which the option buyer has the right to trade the underlying, and is also used for binary options to determine whether the buyer should receive a payout.",
                answer: true,
                id: 42
            },
            {
                question: "{JAPAN ONLY}The Exit Price is the price that is observed at the judgment time, and is used to determine whether a payout should be made.",
                answer: true,
                id: 43
            },
            {
                question: "{JAPAN ONLY}The payout is the amount that the option seller must pay to the buyer if the buyer exercises his right when the conditions for a payout have been satisfied.",
                answer: true,
                id: 44
            },
            {
                question: "{JAPAN ONLY}In OTC currency binary options trading, if the exchange rate during the trading period moves by more than expected in one direction, and there are no longer any exercise prices which can continue to trade, it is possible under certain conditions to add further exercise prices. However, even when further exercise price have been added, the prices of the original options will not be affected.",
                answer: true,
                id: 45
            },
            {
                question: "{JAPAN ONLY}The exit price is important in binary options. In case of handling the OTC currency-related binary options trading for private individuals, the broker company must perform inspections of the exit prices which have been used for determining option payout, and must check whether there is an error in the data in cases where that the company has used rated data provided by third company.",
                answer: true,
                id: 46
            },
            {
                question: "{JAPAN ONLY}About OTC currency for binary options trading, summarizes the profit and loss result of all transactions that have been made between the customer, to publish the information in the company's home page, at any time while the customer is doing the transaction before the start, or the transaction, the information Make sure, for that you're willing to trade under the calm judgment, we are committed to a variety of environmental improvement.",
                answer: true,
                id: 47
            },
            {
                question: "{JAPAN ONLY}For an individual investor, all profits from OTC currency options trading are tax-free.",
                answer: false,
                id: 48
            },
            {
                question: "{JAPAN ONLY}For an individual investor, profits and losses from OTC currency options traing cannot be combined with profits and losses from margin FX and securities-related OTC options.",
                answer: false,
                id: 49
            },
            {
                question: "{JAPAN ONLY}Unless special arrangements are made, cooling-off will not be available after OTC binary options trading contract has been made.",
                answer: true,
                id: 50
            }
        ],
        section4:[
            {
                question: "{JAPAN ONLY}If the buyer of an option does not exercise the option rights, there will be no fee payable to the option seller.",
                answer: false,
                id: 51
            },
            {
                question: "{JAPAN ONLY}If the buyer of an option waives his right to exercise, a transaction in the underlying asset will not be dealt between the seller and the buyer.",
                answer: true, id: 52
            },
            {
                question: "{JAPAN ONLY}The seller of an option should receive the option premium from the buyer, even if the buyer waives the right to exercise the option.",
                answer: true, id: 53
            },
            {
                question: "{JAPAN ONLY}If an option buyer wishes to exercise the option rights, the seller may still reject the deal.",
                answer: false, id: 54
            },
            {
                question: "{JAPAN ONLY}Options are said to be leveraged products because in the case of large moves in the underlying asset price, the values of the options can increase by large amounts compared to the price paid for the option.",
                answer: true, id: 55
            },
            {
                question: "{JAPAN ONLY}The buyer of a vanilla option can choose whether to exercise the option or not. His loss is limited to the price paid for the option, whereas his potential profit is unlimited.",
                answer: true, id: 56
            },
            {
                question: "{JAPAN ONLY}The seller of a vanilla option can not choose whether to exercise the option or not. His profit is limited to the price received for the option, whereas his potential loss is unlimited and could be substantial.",
                answer: true, id: 57
            },
            {
                question: "{JAPAN ONLY}If the exercise period passes without the option being exercised by the buyer, the option premium received by the seller will be the profit made on the trade.",
                answer: true, id: 58
            },
            {
                question: "{JAPAN ONLY}Even if the option is exercise or not exercised, the original option premium remains with the option seller.",
                answer: true, id: 59
            },
            {
                question: "{JAPAN ONLY}The maximum loss for the buyer of an option is the price paid, and the maximium loss for the option seller will be the payout amount minus the opion price he received.",
                answer: true, id: 60
            },
            {
                question: "{JAPAN ONLY}Because option prices are determined by the probability of being exercised, it cannot be said that cheaper options have any natural advantage over expensive options.",
                answer: true,
                id: 61,
            },
            {
                question: "{JAPAN ONLY}Binary options have lower risk than vanilla options for option sellers, because with binary options the maximum loss is fixed.",
                answer: false,
                id: 62
            },
            {
                question: "{JAPAN ONLY}Even though losses in binary options are limited, it is still necessary to take care not to engage in excessive speculative trading and to moderate your transactions volume.",
                answer: true,
                id: 63
            },
            {
                question: "{JAPAN ONLY}If the probablility of a payout is 50% then when the potential payout is less than 100% of the price paid for the option, the expected return on the investment will be less than 100%.",
                answer: true,
                id: 64
            },
            {
                question: "{JAPAN ONLY}It cannot be said that binary options trading is unconditionally advanteous over regular spot fx trading, because investors may lose all of their investment whereas in spot fx trading there will still be some value in the trading position.",
                answer: true,
                id: 65
            },
            {
                question: "{JAPAN ONLY}The particular details of binary options are all the same, no matter which broking company you trade with.",
                answer: false,
                id: 66
            },
            {
                question: "{JAPAN ONLY}Even if all details of the binary options match perfectly, there may still be differences in the prices shown by different broking companies.",
                answer: true,
                id: 67
            },
            {
                question: "{JAPAN ONLY}Prices for currency options are calculated relative the value of theunderlying spot price, and are dependant on multiple factors which may vary.",
                answer: true,
                id: 68
            },
            {
                question: "{JAPAN ONLY}Where broking companies show bid and offer prices for purchasing and sell-back of positions, these prices may become further apart the nearer you are to the exercise time.",
                answer: true,
                id: 69
            },
            {
                question: "{JAPAN ONLY}Option prices depend on the spot price, the time to expiry, the volatility of the spot rate and interest rates.",
                answer: true, id: 70
            },

        ],
        section5:[
            {
                question: "{JAPAN ONLY}The price of an option can be affected by the underlying asset price, by the volatility rate of the underlying asset, or by the time remaining to the exercise time.",
                answer: true, id: 71
            },
            {
                question: "{JAPAN ONLY}The price of a vanilla call option will be lower when price of the underlying asset is low, but the price of the put option will be higher when the price of the underlying asset is low.",
                answer: true, id: 72
            },
            {
                question: "{JAPAN ONLY}If the exercise prices and exercise times are the same for an American style and European style option, then the American style option will have a higher price.",
                answer: true, id: 73
            },
            {
                question: "{JAPAN ONLY}In case of the right to buy the underlying asset (call option), when the underlying asset price falls, the option price will increase.",
                answer: false, id: 74
            },
            {
                question: "{JAPAN ONLY}In case of the right to sell the underlying asset (put option), when the underlying asset price rises, the option price will increase.",
                answer: false, id: 75
            },
            {
                question: "{JAPAN ONLY}For an out-of-the-money option, the further away from the underlying asset price that the option exercise price is, the lower the price of the option will be.",
                answer: true, id: 76
            },
            {
                question: "{JAPAN ONLY}For an in-the-money option, the further away from the underlying asset price that the option exercise price is, the lower the price of the option will be.",
                answer: false, id: 77
            },
            {
                question: "{JAPAN ONLY}If implied volatility increases then the prices of both call and put types of plain vanilla options will increase.",
                answer: true, id: 78
            },
            {
                question: "{JAPAN ONLY}As the expected volatility of the underlying asset increases, a plain vanilla option price will move higher.",
                answer: true, id: 79
            },
            {
                question: "{JAPAN ONLY}For a plain vanilla option, as the time to the exercise point shortens, the price of the option will decrease.",
                answer: true, id: 80
            },
            {
                question: "{JAPAN ONLY}An option price is the sum of the intrinsic-value and the time-value.",
                answer: true,
                id: 81,
            },
            {
                question: "{JAPAN ONLY}If the underlying asset price is 100 yen, the exercise price is 80 yen, and the call option price is 45 yen, then it can be said that the option's intrinsic-value is 20 yen, and its time-value is 25 yen.",
                answer: true,
                id: 82
            },
            {
                question: "{JAPAN ONLY}The time-value of an option represents the expected value of the option at the exercise point, and may be positive, even when the intrinsic-value is zero.",
                answer: true,
                id: 83
            },
            {
                question: "{JAPAN ONLY}As the time to the exercise point shortens, the time-value of a plain vanilla option decreases.",
                answer: true,
                id: 84
            },
            {
                question: "{JAPAN ONLY}A binary option price cannot exceed the payout amount.",
                answer: true,
                id: 85
            },
            {
                question: "{JAPAN ONLY}In general a binary option price will not exceed the payout amount.",
                answer: true,
                id: 86
            },
            {
                question: "{JAPAN ONLY}Unlike a plain vanilla option, an in-the-money binary option will have a lower price, the further away it is from the exercise point.",
                answer: true,
                id: 87
            },
            {
                question: "{JAPAN ONLY}In general the price of a binary option will be lower than the price of a plain vanilla option because the payout amount is fixed.",
                answer: false,
                id: 88
            },
            {
                question: "{JAPAN ONLY}A binary option which is out-of-the-money will have a lower price than an option which is in-the-money because the probability of receiving the payout amount is lower.",
                answer: true,
                id: 89
            },
            {
                question: "{JAPAN ONLY}A binary option which is in-the-money will have a higher value than an option that is out-of-the-money because there will be a higher probability of receiving the payout amount.",
                answer: true, id: 90
            },
            {
                question: "{JAPAN ONLY}As the exercise deadline approaches, the price of an in-the-money binary option will move towards the payout amount.",
                answer: true, id: 91
            },
            {
                question: "{JAPAN ONLY}As the exercise deadline approaches, the price of an out-of-the-money binary option will move towards zero.",
                answer: true, id: 92
            },
            {
                question: "{JAPAN ONLY}The price of a binary option is affected by not only the change in the underlying asset price, but also the change in remaining time to the exercise point.",
                answer: true, id: 93
            },
            {
                question: "{JAPAN ONLY}Implied volatility is a prediction of the future rate of change in the underlying asset.",
                answer: true, id: 94
            },
            {
                question: "{JAPAN ONLY}Historical volatility is a prediction of the future rate of change in the underlying asset.",
                answer: false, id: 95
            },
            {
                question: "{JAPAN ONLY}Delta refers to  a percentage change of the option price with respect to the change in the underlying asset price.",
                answer: true, id: 96
            },
            {
                question: "{JAPAN ONLY}Option prices are normally dependant on elements such as the underlying asset price, the exercise price, the length of time until the exercise point, volatility, and interest rates. Apart from the fixed exercise price, all other elements are changing constantly, so an understanding of the relationships between each element and changes in the options price is necessary for the management of options trading risk.",
                answer: true, id: 97
            },
            {
                question: "{JAPAN ONLY}Option prices are normally dependant on elements such as the underlying asset price, the exercise price, the length of time until the exercise point, volatility, and interest rates. However, when the remaining time to the exercise point is very short, there is no need to consider these when managing option trading risk, as all these elements are constant.",
                answer: false, id: 98
            },
            {
                question: "{JAPAN ONLY}The Black-Scholes model is widely used to calculate theoretical option prices.",
                answer: true, id: 99
            },
            {
                question: "{JAPAN ONLY}A modified version of the Black-Scholes model is widely used to calculate the theoretical prices of binary options.",
                answer: true, id: 100
            },
        ],
    };

    function randomPick4(questions) {
        var availables = Object.keys(questions);

        var randomPicks = [];
        for (var i = 0 ; i < 4 ; i ++) {
            var randomIndex = Math.floor(Math.random() * 100) % availables.length;
            var randomQid = availables[randomIndex];
            var randomPick = questions[randomQid];
            randomPicks.push(randomPick);
            availables.splice(randomIndex, 1);
        }

        return randomPicks;
    }

    function randomPick20() {
        var qFromSection1 = randomPick4(questions.section1);
        var qFromSection2 = randomPick4(questions.section2);
        var qFromSection3 = randomPick4(questions.section3);
        var qFromSection4 = randomPick4(questions.section4);
        var qFromSection5 = randomPick4(questions.section5);

        return [
            qFromSection1,
            qFromSection2,
            qFromSection3,
            qFromSection4,
            qFromSection5
        ];
    }

    function sendResult(results) {
        var status = results >= 14 ? 'pass' : 'fail';
        BinarySocket.send({jp_knowledge_test: 1, score: results, status: status});
    }

    return {
        questions: questions,
        randomPick20: randomPick20,
        sendResult: sendResult
    };
}());
