var PricingTable = (function() {

  var state = {
    prev_prices: {},
    prices: {},
  };

  var ContractDescription = React.createClass({
    displayName: 'ContractDescription',

    render: function render() {

      var values = this.props.longCode.values;
      var longCode = this.props.longCode.mask;

      Object.keys(values).forEach(function(key) {
        longCode = longCode.replace('{' + key + '}', values[key]);
      });

      longCode = longCode.replace(/\[_1\]/, values.currency)
        .replace(/\[_2\]/, values.sum)
        .replace(/\[_3\]/, values.symbol)
        .replace(/\[_4\]/, values.close);


      return React.createElement(
        'div', { className: 'contract_description' },
        React.createElement(
          'h4', { 'className': 'contract_heading ' + this.props.type },
          this.props.contractName
        ),
        React.createElement(
          'div', { 'className': 'contract_longcode' },
          longCode
        )
      );
    }
  });

  var PricingTableCell = React.createClass({
    displayName: "PricingTableCell",

    render: function render() {
      var price = parseInt(this.props.price);
      var inactive = this.props.is_active && price !== 1000 && price !== 0 ? '' : 'inactive';
      var barrierArr = this.props.barrier ? this.props.barrier.split(/ \- /).reverse() : [];
      var props = this.props;

      return React.createElement(
        "div", {
          key: 'inactive',
          "className": "pricing_table_cell col row " +
            this.props.type + "_cell" +
            (this.props.dyn > 0 ? " price_rise" : (this.props.dyn < 0 ? " price_fall" : ''))
        },
        (this.props.empty ? undefined : [
          React.createElement(
            "div", { "className": inactive, key: 'inactive' }
          ),
          React.createElement(
            "div", { "className": "price", "key": "price" },
            '¥' + price
          ),
          (this.props.type === 'buy' ? React.createElement(
            "div", {
              "className": "col button",
              "key": "button",
              onClick: function() {
                buyContract({
                  price: price,
                  units: props.units,
                  contractType: props.contractType,
                  symbol: props.symbol,
                  dateExpiry: props.dateExpiry,
                  barrier: barrierArr[0],
                  barrier2: barrierArr[1],
                });
              }
            },
            Content.localize()['textBuy']
          ) : undefined)
        ])
      );
    }

  });

  var PricingTableHeader = React.createClass({
    displayName: "PricingTableHeader",
    render: function render() {
      var barrierLabel = Content.localize().textBarrier;
      var buyPriceUnitLabel = Content.localize().textBuyPriceUnit;
      var sellPriceUnitLabel = Content.localize().textSellPriceUnit;

      return React.createElement(
        'div', { 'className': 'pricing_table_row row heading' },
        React.createElement(
          'div', { 'className': 'col exercise_price_h' },
          barrierLabel
        ),
        React.createElement(
          'div', { 'className': 'col prices_h' },
          buyPriceUnitLabel
        ),
        React.createElement(
          'div', { 'className': 'col prices_h' },
          sellPriceUnitLabel
        ),
        React.createElement(
          'div', { 'className': 'col prices_h' },
          buyPriceUnitLabel
        ),
        React.createElement(
          'div', { 'className': 'col prices_h' },
          sellPriceUnitLabel
        )
      );
    }
  });

  var PricingTableRow = React.createClass({
    displayName: "PricingTableRow",

    render: function render() {
      var types = Object.keys(this.props.values);
      var buy1 = React.createElement(PricingTableCell, { type: 'buy', is_active: 0, price: 1000 });
      var sell1 = React.createElement(PricingTableCell, { type: 'sell', is_active: 0, price: 0 });
      var buy2 = React.createElement(PricingTableCell, { type: 'buy', is_active: 0, price: 1000 });
      var sell2 = React.createElement(PricingTableCell, { type: 'sell', is_active: 0, price: 0 });

      var barrier = this.props.barrier.replace(/_/, ' - ');

      for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var position = contractTypeDisplayMapping(type);
        var dyn = 0;
        if (this.props.prev_values !== undefined && this.props.prev_values[type] !== undefined) {
          if (this.props.values[type] > this.props.prev_values[type]) {
            dyn = 1;
          } else if (this.props.values[type] < this.props.prev_values[type]) {
            dyn = -1;
          }
        }

        if (position === 'top') {
          buy1 = React.createElement(PricingTableCell, {
            type: 'buy',
            is_active: 1,
            price: this.props.values[type],
            dyn: dyn,
            barrier: barrier,
            contractType: type,
            units: this.props.units,
            symbol: this.props.symbol,
            dateExpiry: this.props.dateExpiry,
          });
          sell2 = React.createElement(PricingTableCell, {
            type: 'sell',
            is_active: 1,
            price: 1000 - this.props.values[type],
            dyn: dyn,
            barrier: barrier,
            contractType: type,
            units: this.props.units,
            symbol: this.props.symbol,
            dateExpiry: this.props.dateExpiry,
          });
        } else {
          buy2 = React.createElement(PricingTableCell, {
            type: 'buy',
            is_active: 1,
            price: this.props.values[type],
            dyn: dyn,
            barrier: barrier,
            contractType: type,
            units: this.props.units,
            symbol: this.props.symbol,
            dateExpiry: this.props.dateExpiry,
          });
          sell1 = React.createElement(PricingTableCell, {
            type: 'sell',
            is_active: 1,
            price: 1000 - this.props.values[type],
            dyn: dyn,
            barrier: barrier,
            contractType: type,
            units: this.props.units,
            symbol: this.props.symbol,
            dateExpiry: this.props.dateExpiry,
          });
        }
      }

      return React.createElement(
        "div", { "className": "pricing_table_row row" },
        React.createElement(
          "div", { "className": "col barrier" },
          barrier
        ),
        buy1,
        sell1,
        buy2,
        sell2
      );
    }
  });


  var PricingTable = React.createClass({
    displayName: "PricingTable",

    render: function render() {
      var barriers = Object.keys(this.props.prices).sort(function(a, b) {
        return (a > b ? -1 : 1);
      });

      var i = 1;
      var props = this.props;
      var rows = barriers.map(function(barrier) {
        return React.createElement(PricingTableRow, {
          key: i++,
          barrier: barrier,
          values: props.prices[barrier],
          prev_values: (props.prev_prices !== undefined ? props.prev_prices[barrier] : undefined),
          units: props.units,
          dateExpiry: props.dateExpiry,
          symbol: props.symbol,
        });
      });
      rows.unshift(React.createElement(PricingTableHeader, { key: 0 }));

      return React.createElement(
        "div", { "className": "pricing_table" },
        rows
      );
    }
  });

  function sendRequest(form) {
    if (form.contract_category && form.date_expiry && form.date_start && form.symbol) {
      $('#pricing_table').hide();
      $('#contract_description1').hide();
      state.prev_prices = {};
      state.prices = {};
      state.category = form.contract_category;
      state.dateExpiry = form.date_expiry;
      state.dateStart = form.date_start;
      state.symbol = form.symbol;
      state.units = form.units;
      BinarySocket.send({
        pricing_table: 1,
        contract_category: form.contract_category,
        date_expiry: form.date_expiry,
        date_start: form.date_start,
        symbol: form.symbol,
        type: 'japan',
      });
    }
  }

  function buyContract(params) {
    var buyContractParams = {
      buy: 1,
      price: params.price * params.units,
      parameters: {
        amount: params.units * 1000,
        basis: 'payout',
        contract_type: params.contractType,
        currency: 'JPY',
        symbol: params.symbol,
        date_expiry: params.dateExpiry,
        barrier: params.barrier,
      }
    };

    if (params.barrier2) {
      buyContractParams.parameters.barrier2 = params.barrier2;
    }

    $('#trading_init_progress').show();

    BinarySocket.send(buyContractParams);
  }

  function handleResponse(res) {
    var echo_req = res.echo_req;

    if (!document.getElementById('pricing_table')) {
      processForgetTables();
    } else if (state.category === echo_req.contract_category &&
      state.dateExpiry === echo_req.date_expiry &&
      state.symbol === echo_req.symbol &&
      state.dateStart === echo_req.date_start) {

      state.prev_prices = state.prices;
      state.prices = res.pricing_table.prices;

      var contractTypes = Contract.contractType()[state.category];
      var close = $("#period option:selected").text();
      close = close.replace(/\s+\(.+$/, '');

      if (contractTypes) {

        Object.keys(contractTypes).forEach(function(type) {
          var contractName = contractTypes[type];
          var mask = Content.localize()['text' + type];
          if (mask) {
            var longCode = {
              mask: mask,
              values: {
                currency: '¥',
                sum: 1000,
                symbol: state.symbol,
                close: close,
              },
            };

            var position = contractTypeDisplayMapping(type);
            var positionIndex = position === 'top' ? 1 : 2;

            ReactDOM.render(
              React.createElement(ContractDescription, {
                longCode: longCode,
                type: type,
                contractName: contractName,
              }),
              document.getElementById('contract_description' + positionIndex)
            );
            $('#contract_description' + positionIndex).css('display', 'flex');
          }
        });
      }

      ReactDOM.render(
        React.createElement(PricingTable, state),
        document.getElementById('pricing_table')
      );

      $('#pricing_table').show();
    }
  }

  function processBuy(res) {
    $('#trading_init_progress').hide();

    if (res.error) {
      alert(res.error.message);
    } else {
      var button = $('<div />', { contract_id: res.buy.contract_id }).get(0);
      ViewPopupWS.init(button);
    }
  }

  return {
    sendRequest: sendRequest,
    handleResponse: handleResponse,
    getState: function() {
      return state;
    },
    processBuy: processBuy
  };
})();

