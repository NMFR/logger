// The function to place in the log level when that log level is disabled.
function noLog() {};

/*
	The function to place in the log level when that log level is enabled.
	
	This function wraps around an exiting logger and a logger method. 
	    
	Params:
		logObj: The logger object that will be wrapped (probably the console object).
		logMethod: The logObj method that should be wrapped (probably on of the following method: console.debug, console.info, console.warn or console.error).
		type: A string that indicates the log level. This string will be prefixed to the messages being logged.
	Return:
		A logging function will be returned that wraps the logger and a logger method.
		The returned function will prefix the current time and the type param to the arguments and call the logMethod.
*/
function setupLog(logObj, logMethod, type) {
	return (function() {
		var perfix = "[" + (new Date()).toISOString() + "] " + (type ? type + ":" : "");
		Array.prototype.unshift.call(arguments, perfix);
		logMethod.apply(logObj, arguments);
	});
};

var Logger = function(config) {

	this.log = setupLog(console, console.log);

	this.reconfig(config);
};

// Reconfigure the logger, according to the newConfig options object the log levels will be enable or disabled. 
Logger.prototype.reconfig = function(newConfig) {

	this.config = newConfig || {};

	this.debug = (this.config.debug ? setupLog(console, console.log, "DEBUG") : noLog);
	this.info = (this.config.info ? setupLog(console, console.info, "INFO") : noLog);
	this.warn = (this.config.warn ? setupLog(console, console.warn, "WARN") : noLog);
	this.error = (this.config.error ? setupLog(console, console.error, "ERROR") : noLog);
};

var loggerFactory = function(config) {
	return new Logger(config);
};

exports.createLogger = loggerFactory;
// Create the global logger.
exports.global = new Logger({
	debug: true,
	info: true,
	warn: true,
	error: true
});
