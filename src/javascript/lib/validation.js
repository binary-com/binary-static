!function(exports) {
  function success(value) {
    this.value = value;
  }

  success.prototype = {
    isFailure: false,
    ok:   function(fn) { fn(this.value); return this; },
    err:  function(fn) { return this; },
    then: function(fn) { return fn(this.value); },
    fmap: function(fn) { return this; },
    ap:   function(obj) {
      return obj.isFailure
        ? obj
        : this;
    },
  };

  function failure(value) {
    this.value = value;
  }

  failure.prototype = {
    isFailure: true,
    ok:   function(fn) { return this; },
    err:  function(fn) { fn(this.value); return this; },
    then: function(fn) { return this; },
    fmap: function(fn) { return fn(this.value); },
    ap:   function(obj) {
      return obj.isFailure
        ? new failure(this.value.concat(obj.value))
        : this;
    },
  };

  exports.Success = function(v) { return new success(v); };
  exports.Failure = function(v) { return new failure(v); };
}(
  typeof module !== 'undefined'
    ? module.exports
    : window
);
