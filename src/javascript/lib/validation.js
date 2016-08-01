var dv = (function() {
  function ok(v) {
    if (!(this instanceof ok)) return new ok(v);
    this.value = v;
  }

  ok.prototype = {
    isOk: true,
    then: function(f) { return ok(f(this.value)); },
    fmap: function(f) { return this; },
    ap:   function(o) { return o.isOk ? this : o; },
  };

  function fail(v) {
    if (!(this instanceof fail)) return new fail(v);
    this.value = [v];
  }

  fail.of = function(v) {
    var f = fail();
    f.value = v;
    return f;
  }

  fail.prototype = {
    isOk: false,
    then: function(f) { return this; },
    fmap: function(f) { return fail.of(this.value.map(f)); },
    ap:   function(o) {
      return o.isOk
        ? this
        : fail.of(this.value.concat(o.value));
    }
  };

  function combine(v, xs) {
    return xs.reduce(function(prev, curr) {
      return prev.ap(curr);
    }, ok(v));
  }

  function check(fn, err) {
    return function(v) {
      return fn(v) ? ok(v) : fail(err);
    };
  }

  function first(datum, xs) {
    var u = ok(datum);
    for (var i = 0; i < xs.length; i++) {
      var fn = xs[i];
      u = fn(u.value);
      if (!u.isOk) break;
    }
    return u;
  }

  return {
    ok: ok,
    fail: fail,
    combine: combine,
    check: check,
    first: first,
  };
})();

if (typeof module !== 'undefined') {
  module.exports = dv;
}
