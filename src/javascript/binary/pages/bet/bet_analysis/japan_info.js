BetAnalysis.JapanInfo = function() {

    this.show = this.hide = function(){};
    
    if (isJapanTrading() && $('#all_prices').length) {
        $('#tab_japan_info').removeClass('invisible');
    } else {
        return;
    }

    var $container = $('#tab_japan_info-content');
    var $rows = {};
    var socket;

    if (!$container.length) {
        return;
    }

    var add_header = function() {
        var names = Contract.contractType()[Contract.form()];
        var ask, bid;
        for (var i = 0; i < Object.keys(names).length; i++) {
            var pos = contractTypeDisplayMapping(Object.keys(names)[i]);
            if (pos === 'top') {
                ask = names[Object.keys(names)[i]];
            } else if (pos === 'bottom') {
                bid = names[Object.keys(names)[i]];
            }
        }
        var $header = $('<div />', {
            'class': 'grd-parent grd-grid-12 grd-centered table-header grd-row-padding'
        }).append(
            $('<div />', {
                'class': 'grd-grid-4 center-aligned',
                'text': Content.localize().textExercisePeriod
            }),
            $('<div />', {
                'class': 'grd-grid-4 center-aligned',
                'text': ask
            }),
            $('<div />', {
                'class': 'grd-grid-4 center-aligned',
                'text': bid
            })
        );
        $container.append($header);
    };

    var add_row = function(barrier, id, ask, bid) {
        $rows[id] = $('<div />', {
            'class': 'grd-parent grd-grid-12 grd-centered table-body table-body-lines grd-row-paddingd',
        }).append(
            $('<div />', {
                'class': 'grd-grid-4 center-aligned',
                'text': barrier
            }),
            $('<div />', {
                'class': 'grd-grid-4 center-aligned ask',
                'text': ask
            }),
            $('<div />', {
                'class': 'grd-grid-4 center-aligned bid',
                'text': bid
            })
        );
        $container.append($rows[id]);
    };

    var update_ask = function(id, ask) {
        if (!$rows[id]) {
            return;
        }
        $rows[id].find('.ask').text(ask);
    };

    var update_bid = function(id, bid) {
        if (!$rows[id]) {
            return;
        }
        $rows[id].find('.bid').text(bid);
    };

    var clean = function() {
        $container.text('');
        $rows = {};
    };

    var request_prices = function() {
        var barriers1 = Periods.barriers1();
        var barriers2 = Periods.barriers2();

        var types = Contract.contractType()[Contract.form()];

        var period = $('#period').val();
        var p = period.match(/^\d+_(\d+)$/);

        var proposal = {
            'proposal': 1,
            'amount': 1000,
            'basis': 'payout',
            'currency': $('#currency').val(),
            'symbol': $('#underlying').val(),
            'date_expiry': p[1]
        };

        var id = 0;
        if (barriers2.length) {
            for (var i = 0; i < barriers2.length; i++) {
                for (var j = 0; j < barriers1.length; j++) {
                    id++;
                    add_row(barriers2[i] + ' - ' + barriers1[j], id);
                    for (var typeOfContract in types) {
                        if (types.hasOwnProperty(typeOfContract)) {
                            var req = $.extend({}, proposal, {
                                'barrier': barriers1[j],
                                'barrier2': barriers2[i],
                                'contract_type': typeOfContract,
                                'passthrough': {
                                    'form_id': 'japan_barriers',
                                    'id': id
                                }
                            });
                            socket.send(req);
                        }
                    }
                }
            }
        } else {
            for (var d = 0; d < barriers1.length; d++) {
                id++;
                add_row(barriers1[d], id);
                for (var typeOfContract2 in types) {
                    if (types.hasOwnProperty(typeOfContract2)) {
                        var req2 = $.extend({}, proposal, {
                            'barrier': barriers1[d],
                            'contract_type': typeOfContract2,
                            'passthrough': {
                                'form_id': 'japan_barriers',
                                'id': id
                            }
                        });
                        socket.send(req2);
                    }
                }
            }
        }
    };

    var processRes = function(res) {
        if (res.echo_req.passthrough.id && $rows[res.echo_req.passthrough.id]) {
            var position = contractTypeDisplayMapping(res.echo_req.contract_type);
            if (position === 'top') {
                update_ask(res.echo_req.passthrough.id, res.proposal ? res.proposal.ask_price : '-');
            } else if (position === 'bottom') {
                update_bid(res.echo_req.passthrough.id, res.proposal ? res.proposal.ask_price : '-');
            }
        }
    };

    this.show = function() {
        clean();
        add_header();
        if (typeof socket !== 'object' || socket.readyState !== 1) {
            socket = new BinarySocketClass();
            socket.init({
                onopen: function() {
                    request_prices();
                },
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        processRes(response);
                    }
                },

            });
        } else {
            request_prices();
        }

    };

    this.hide = function() {
        if (typeof socket === 'object') {
            socket.close();
        }
    };
};
