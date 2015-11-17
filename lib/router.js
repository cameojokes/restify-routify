/**
 * @author James Cooke
 * @file restify-routify - Creates nested routify routes
 * @copyright James Cooke (c) 2015
 */

/**
 * @external Restify
 * @see {@link http://restify.com|Restify}
 */

/**
 * @constant idMethods
 * @desc http methods
 * @type {string[]}
 */
var idMethods = ['del', 'get', 'patch', 'put'];

/**
 * @constant methods
 * @desc additional http methods
 * @type {Array.<string>}
 */
var methods = ['list', 'post'].concat(idMethods);

/**
 * @constructor Router
 * @desc creates a new Router
 * @param {string} name - The URL prefix for the router(/[name]).
 * This argument is optional if you wish to create an extendable router for the root path(/)
 * @param {string} param - The URL parameter for members of this routes collection(/[name]/:[param]).
 * This argument is optional, and should only be provided when the router is used for a collection.
 * @example To create a base router for /accounts:
 * var accountsRouter = new Router('accounts', 'accountId');
 */
function Router(name, param) {
	this.routes = {
		del: [],
		get: [],
		list: [],
		patch: [],
		post: [],
		put: [],
	};

	this.name = name;
	this.param = param;
}

/**
 * @function extend
 * @desc Extends a route so you can add more routes to the same restify app
 * @param {Router} router object instance
 */
Router.prototype.extend = function add(router) {
	var prefix = this.makePath(true);
	var routes = this.routes;

	/**
	 * @function eachRoute
	 * @desc adds route handler and path objects to a route with a method property
	 * @inner
	 * @param {string} method - one of del|get|list|patch|post|put
	 * @param {Object} route - object consisting of an array of handlers and a path
	 */
	function eachRoute(method, route) {
		var path = prefix + route.path;

		var extendedRoute = {
			handlers: route.handlers,
			path: path,
		};

		routes[method].unshift(extendedRoute);
	}

	router.iterateRoutes(eachRoute.bind(this));
};

/**
 * @function iterateRoutes
 * @desc iterates over array of callbacks assigned to each method
 * @param {middlewareOrRouteHandlerCallback} cb - a middleware or route handler
 */
Router.prototype.iterateRoutes = function iterateRoutes(cb) {
	methods.forEach(function eachMethod(method) {
		this.routes[method].forEach(function eachRoute(route) {
			cb(method, route);
		});
	}.bind(this));
};
/**
 * @callback middlewareOrRouteHandlerCallback
 * @description restify compatible middleware or route handler
 * @param {object} error
 * @param {object} request
 * @param {object} response
 * @param {object} object
 */

/**
 * @function routify
 * @desc applies router to restify app
 * @param {RestifyServer} app - Restify server app
 */
Router.prototype.routify = function setRoutes(app) {
	/**
	 * @function eachRoute
	 * @desc assigns the `list` method to the get HTTP verb
	 * @inner
	 * @param {string} method - one of del|get|list|patch|post|put
	 * @param {Object} route - object consisting of an array of handlers and a path
	 */
	function eachRoute(method, route) {
		var methodLocal = method === 'list' ? 'get' : method;
		app[methodLocal].apply(app, [route.path].concat(route.handlers));
	}

	this.iterateRoutes(eachRoute);
};
/**
 * @typedef {Object} RestifyServer
 * @desc Restify Server app
 */

/**
 * @function makePath
 * @desc takes the URL prefix name and creates a path
 * @param {boolean} method - method exists
 * @returns {*}
 */
Router.prototype.makePath = function makePath(method) {
	if (!this.name) {
		return '';
	}
	var path = '/' + this.name;
	var useParam = this.param &&
		(method === true || idMethods.indexOf(method) !== -1);

	if (useParam) {
		path += '/:' + this.param;
	}

	return path;
};

methods.forEach(function eachMethod(method) {
	/**
	 * @function
	 * @desc dynamic function / factory which creates an object literal
	 * of handlers and paths for each route object with a method property
	 * @returns {*}
	 */
	Router.prototype[method] = function methodSetter() {
		var handlers = new Array(arguments.length);
		var idx;

		for (idx = 0; idx < handlers.length; idx++) {
			handlers[idx] = arguments[idx];
		}

		this.routes[method].push({
			handlers: handlers,
			path: this.makePath(method),
		});

		return this;
	};
});

/**
 * @module
 * @type {Router}
 */
module.exports = Router;
/**
 * @typedef {Object} Router
 * @desc Routerify Router instance
 */


