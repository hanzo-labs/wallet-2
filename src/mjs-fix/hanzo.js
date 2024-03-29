import cookies from 'es-cookies';
import Xhr from 'es-xhr-promise';

// node_modules/es-tostring/index.mjs
function toString(obj) {
  return Object.prototype.toString.call(obj)
}

// node_modules/es-is/function.js
// Generated by CoffeeScript 1.12.5
var isFunction;

var isFunction$1 = isFunction = function(value) {
  var str;
  if (typeof window !== 'undefined' && value === window.alert) {
    return true;
  }
  str = toString(value);
  return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]';
};

// node_modules/es-is/string.js

// src/utils.coffee
var updateParam;

var statusOk = function(res) {
  return res.status === 200;
};

var statusCreated = function(res) {
  return res.status === 201;
};

var GET = 'GET';

var POST = 'POST';

var PATCH = 'PATCH';

var newError = function(data, res, err) {
  var message, ref, ref1, ref2, ref3, ref4;
  if (res == null) {
    res = {};
  }
  message = (ref = (ref1 = res.data) != null ? (ref2 = ref1.error) != null ? ref2.message : void 0 : void 0) != null ? ref : 'Request failed';
  if (err == null) {
    err = new Error(message);
  }
  err.data = res.data;
  err.msg = message;
  err.req = data;
  err.responseText = res.data;
  err.status = res.status;
  err.type = (ref3 = res.data) != null ? (ref4 = ref3.error) != null ? ref4.type : void 0 : void 0;
  return err;
};

updateParam = function(url, key, value) {
  var hash, re, separator;
  re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi');
  if (re.test(url)) {
    if (value != null) {
      return url.replace(re, '$1' + key + '=' + value + '$2$3');
    } else {
      hash = url.split('#');
      url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
      if (hash[1] != null) {
        url += '#' + hash[1];
      }
      return url;
    }
  } else {
    if (value != null) {
      separator = url.indexOf('?') !== -1 ? '&' : '?';
      hash = url.split('#');
      url = hash[0] + separator + key + '=' + value;
      if (hash[1] != null) {
        url += '#' + hash[1];
      }
      return url;
    } else {
      return url;
    }
  }
};

var updateQuery = function(url, data) {
  var k, v;
  if (typeof data !== 'object') {
    return url;
  }
  for (k in data) {
    v = data[k];
    url = updateParam(url, k, v);
  }
  return url;
};

// src/api.coffee
var Api;

Api = (function() {
  Api.BLUEPRINTS = {};

  Api.CLIENT = null;

  function Api(opts) {
    var blueprints, client, k, v;
    if (opts == null) {
      opts = {};
    }
    if (!(this instanceof Api)) {
      return new Api(opts);
    }
    blueprints = opts.blueprints, client = opts.client;
    this.client = client || new this.constructor.CLIENT(opts);
    if (blueprints == null) {
      blueprints = this.constructor.BLUEPRINTS;
    }
    for (k in blueprints) {
      v = blueprints[k];
      this.addBlueprints(k, v);
    }
  }

  Api.prototype.addBlueprints = function(api, blueprints) {
    var bp, name;
    if (this[api] == null) {
      this[api] = {};
    }
    for (name in blueprints) {
      bp = blueprints[name];
      this.addBlueprint(api, name, bp);
    }
  };

  Api.prototype.addBlueprint = function(api, name, bp) {
    var method;
    if (isFunction$1(bp)) {
      return this[api][name] = (function(_this) {
        return function() {
          return bp.apply(_this, arguments);
        };
      })(this);
    }
    if (bp.expects == null) {
      bp.expects = statusOk;
    }
    if (bp.method == null) {
      bp.method = GET;
    }
    method = (function(_this) {
      return function(data, cb) {
        var key;
        key = void 0;
        if (bp.useCustomerToken) {
          key = _this.client.getCustomerToken();
        }
        return _this.client.request(bp, data, key).then(function(res) {
          var ref, ref1;
          if (((ref = res.data) != null ? ref.error : void 0) != null) {
            throw newError(data, res);
          }
          if (!bp.expects(res)) {
            throw newError(data, res);
          }
          if (bp.process != null) {
            bp.process.call(_this, res);
          }
          return (ref1 = res.data) != null ? ref1 : res.body;
        }).callback(cb);
      };
    })(this);
    return this[api][name] = method;
  };

  Api.prototype.setKey = function(key) {
    return this.client.setKey(key);
  };

  Api.prototype.setCustomerToken = function(key) {
    return this.client.setCustomerToken(key);
  };

  Api.prototype.deleteCustomerToken = function() {
    return this.client.deleteCustomerToken();
  };

  Api.prototype.setStore = function(id) {
    this.storeId = id;
    return this.client.setStore(id);
  };

  return Api;

})();

var Api$1 = Api;

// src/client/client.coffee
var Client,
  slice = [].slice;

Client = (function() {
  function Client(opts) {
    var k, v;
    if (opts == null) {
      opts = {};
    }
    this.opts = {
      debug: false,
      endpoint: 'https://api.hanzo.io',
      session: {
        name: 'hzo',
        expires: 7 * 24 * 3600 * 1000
      }
    };
    for (k in opts) {
      v = opts[k];
      this.opts[k] = v;
    }
  }

  Client.prototype.getKey = function() {
    return this.opts.key;
  };

  Client.prototype.setKey = function(key) {
    return this.opts.key = key;
  };

  Client.prototype.getCustomerToken = function() {
    var session;
    if ((session = cookies.getJSON(this.opts.session.name)) != null) {
      if (session.customerToken != null) {
        this.customerToken = session.customerToken;
      }
    }
    return this.customerToken;
  };

  Client.prototype.setCustomerToken = function(key) {
    cookies.set(this.opts.session.name, {
      customerToken: key
    }, {
      expires: this.opts.session.expires
    });
    return this.customerToken = key;
  };

  Client.prototype.deleteCustomerToken = function() {
    cookies.set(this.opts.session.name, {
      customerToken: null
    }, {
      expires: this.opts.session.expires
    });
    return this.customerToken = null;
  };

  Client.prototype.url = function(url, data, key) {
    if (isFunction$1(url)) {
      url = url.call(this, data);
    }
    return updateQuery(this.opts.endpoint + url, {
      token: key
    });
  };

  Client.prototype.log = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    args.unshift('hanzo.js>');
    if (this.opts.debug && (typeof console !== "undefined" && console !== null)) {
      return console.log.apply(console, args);
    }
  };

  return Client;

})();

var Client$1 = Client;

// src/client/browser.coffee
var BrowserClient,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BrowserClient = (function(superClass) {
  extend(BrowserClient, superClass);

  function BrowserClient(opts) {
    BrowserClient.__super__.constructor.call(this, opts);
    if (!(this instanceof BrowserClient)) {
      return new BrowserClient(opts);
    }
    this.getCustomerToken();
  }

  BrowserClient.prototype.request = function(blueprint, data, key) {
    var opts;
    if (data == null) {
      data = {};
    }
    if (key == null) {
      key = this.getKey();
    }
    opts = {
      url: this.url(blueprint.url, data, key),
      method: blueprint.method
    };
    if (blueprint.method !== 'GET') {
      opts.headers = {
        'Content-Type': 'application/json'
      };
    }
    if (blueprint.method === 'GET') {
      opts.url = updateQuery(opts.url, data);
    } else {
      opts.data = JSON.stringify(data);
    }
    this.log('request', {
      key: key,
      opts: opts
    });
    return (new Xhr).send(opts).then((function(_this) {
      return function(res) {
        _this.log('response', res);
        res.data = res.responseText;
        return res;
      };
    })(this))["catch"]((function(_this) {
      return function(res) {
        var err, ref;
        try {
          res.data = (ref = res.responseText) != null ? ref : JSON.parse(res.xhr.responseText);
        } catch (error) {
          err = error;
        }
        err = newError(data, res, err);
        _this.log('response', res);
        _this.log('error', err);
        throw err;
      };
    })(this));
  };

  return BrowserClient;

})(Client$1);

var Client$2 = BrowserClient;

// src/blueprints/url.coffee
var sp;

var storePrefixed = sp = function(u) {
  return function(x) {
    var url;
    if (isFunction$1(u)) {
      url = u(x);
    } else {
      url = u;
    }
    if (this.storeId != null) {
      return ("/store/" + this.storeId) + url;
    } else {
      return url;
    }
  };
};

var byId = function(name) {
  switch (name) {
    case 'coupon':
      return sp(function(x) {
        var ref;
        return "/coupon/" + ((ref = x.code) != null ? ref : x);
      });
    case 'collection':
      return sp(function(x) {
        var ref;
        return "/collection/" + ((ref = x.slug) != null ? ref : x);
      });
    case 'product':
      return sp(function(x) {
        var ref, ref1;
        return "/product/" + ((ref = (ref1 = x.id) != null ? ref1 : x.slug) != null ? ref : x);
      });
    case 'variant':
      return sp(function(x) {
        var ref, ref1;
        return "/variant/" + ((ref = (ref1 = x.id) != null ? ref1 : x.sku) != null ? ref : x);
      });
    case 'site':
      return function(x) {
        var ref, ref1;
        return "/site/" + ((ref = (ref1 = x.id) != null ? ref1 : x.name) != null ? ref : x);
      };
    default:
      return function(x) {
        var ref;
        return "/" + name + "/" + ((ref = x.id) != null ? ref : x);
      };
  }
};

// src/blueprints/browser.coffee
var blueprints, createBlueprint, fn, fn1, i, j, len, len1, marketingModels, model, models;

createBlueprint = function(name) {
  var endpoint;
  endpoint = "/" + name;
  return {
    list: {
      url: endpoint,
      method: GET,
      expects: statusOk
    },
    get: {
      url: byId(name),
      method: GET,
      expects: statusOk
    }
  };
};

blueprints = {
  library: {
    shopjs: {
      url: '/library/shopjs',
      method: POST,
      expects: statusOk
    }
  },
  account: {
    get: {
      url: '/account',
      method: GET,
      expects: statusOk,
      useCustomerToken: true
    },
    update: {
      url: '/account',
      method: PATCH,
      expects: statusOk,
      useCustomerToken: true
    },
    exists: {
      url: function(x) {
        var ref, ref1, ref2;
        return "/account/exists/" + ((ref = (ref1 = (ref2 = x.email) != null ? ref2 : x.username) != null ? ref1 : x.id) != null ? ref : x);
      },
      method: GET,
      expects: statusOk,
      process: function(res) {
        return res.data.exists;
      }
    },
    create: {
      url: '/account/create',
      method: POST,
      expects: statusCreated
    },
    enable: {
      url: function(x) {
        var ref;
        return "/account/enable/" + ((ref = x.tokenId) != null ? ref : x);
      },
      method: POST,
      expects: statusOk
    },
    login: {
      url: '/account/login',
      method: POST,
      expects: statusOk,
      process: function(res) {
        this.setCustomerToken(res.data.token);
        return res;
      }
    },
    logout: function() {
      return this.deleteCustomerToken();
    },
    reset: {
      url: '/account/reset',
      method: POST,
      expects: statusOk,
      useCustomerToken: true
    },
    updateOrder: {
      url: function(x) {
        var ref, ref1;
        return "/account/order/" + ((ref = (ref1 = x.orderId) != null ? ref1 : x.id) != null ? ref : x);
      },
      method: PATCH,
      expects: statusOk,
      useCustomerToken: true
    },
    confirm: {
      url: function(x) {
        var ref;
        return "/account/confirm/" + ((ref = x.tokenId) != null ? ref : x);
      },
      method: POST,
      expects: statusOk,
      useCustomerToken: true
    }
  },
  cart: {
    create: {
      url: '/cart',
      method: POST,
      expects: statusCreated
    },
    update: {
      url: function(x) {
        var ref;
        return "/cart/" + ((ref = x.id) != null ? ref : x);
      },
      method: PATCH,
      expects: statusOk
    },
    discard: {
      url: function(x) {
        var ref;
        return "/cart/" + ((ref = x.id) != null ? ref : x) + "/discard";
      },
      method: POST,
      expects: statusOk
    },
    set: {
      url: function(x) {
        var ref;
        return "/cart/" + ((ref = x.id) != null ? ref : x) + "/set";
      },
      method: POST,
      expects: statusOk
    }
  },
  review: {
    create: {
      url: '/review',
      method: POST,
      expects: statusCreated
    },
    get: {
      url: function(x) {
        var ref;
        return "/review/" + ((ref = x.id) != null ? ref : x);
      },
      method: GET,
      expects: statusOk
    }
  },
  checkout: {
    authorize: {
      url: storePrefixed('/checkout/authorize'),
      method: POST,
      expects: statusOk
    },
    capture: {
      url: storePrefixed(function(x) {
        var ref;
        return "/checkout/capture/" + ((ref = x.orderId) != null ? ref : x);
      }),
      method: POST,
      expects: statusOk
    },
    charge: {
      url: storePrefixed('/checkout/charge'),
      method: POST,
      expects: statusOk
    },
    paypal: {
      url: storePrefixed('/checkout/paypal'),
      method: POST,
      expects: statusOk
    }
  },
  referrer: {
    create: {
      url: '/referrer',
      method: POST,
      expects: statusCreated
    },
    get: {
      url: function(x) {
        var ref;
        return "/referrer/" + ((ref = x.id) != null ? ref : x);
      },
      method: GET,
      expects: statusOk
    }
  },
  marketing: {
    create: {
      url: '/marketing',
      method: POST,
      expects: statusCreated
    }
  }
};

models = ['collection', 'coupon', 'product', 'variant', 'copy', 'media'];

fn = function(model) {
  return blueprints[model] = createBlueprint(model);
};
for (i = 0, len = models.length; i < len; i++) {
  model = models[i];
  fn(model);
}

marketingModels = ['adcampaign', 'adconfig', 'adset', 'ad'];

fn1 = function(model) {
  return blueprints[model] = createBlueprint("marketing/" + model);
};
for (j = 0, len1 = marketingModels.length; j < len1; j++) {
  model = marketingModels[j];
  fn1(model);
}

var blueprints$1 = blueprints;

// src/browser.coffee
var Hanzo;

Api$1.BLUEPRINTS = blueprints$1;

Api$1.CLIENT = Client$2;

Hanzo = function(opts) {
  if (opts == null) {
    opts = {};
  }
  if (opts.client == null) {
    opts.client = new Client$2(opts);
  }
  if (opts.blueprints == null) {
    opts.blueprints = blueprints$1;
  }
  return new Api$1(opts);
};

Hanzo.Api = Api$1;

Hanzo.Client = Client$2;

var Hanzo$1 = Hanzo;

export default Hanzo$1;
//# sourceMappingURL=hanzo.mjs.map
