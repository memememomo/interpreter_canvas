// <program> ::= program <command list>
var ProgramNode = function(context) {};
ProgramNode.prototype = {
    parse: function(context) {
	context.skipToken("program");
	this.commandListNode = new CommandListNode();
	this.commandListNode.parse(context);
    },
    execute: function() {
	return this.commandListNode.execute();
    },
    toString: function() {
	return "[program " + this.commandListNode + "]";
    }
};

// <command list> ::= <command>* end
var CommandListNode = function() { this.list = new Array(); };
CommandListNode.prototype = {
    parse: function(context) {
	try {
	    while (true) {
		if (context.currentToken == null) {
		    throw "Missing 'end'";
		} else if (context.currentToken == "end") {
		    context.skipToken("end");
		    break;
		} else {
		    var commandNode = new CommandNode();
		    commandNode.parse(context);
		    this.list.push(commandNode);
		}
	    }
	} catch(e) {
	    alert(e);
            return false;
	}
        return true;
    },
    execute: function() {
	var command_list = new Array();
	for (var i = 0; i < this.list.length; i++) {
	    var list = this.list[i].execute();
	    command_list = command_list.concat(list);
	}
	return command_list;
    },
    toString: function() {
	var buf = this.list.join(', ');
	return '[' + buf + ']';
    }
};


// <command> ::= <repeat command> | <primitive command>
var CommandNode = function(){};
CommandNode.prototype = {
    parse: function(context) {
	if (context.currentToken == "repeat") {
	    this.node = new RepeatCommandNode();
	    this.node.parse(context);
	} else {
	    this.node = new PrimitiveCommandNode();
	    this.node.parse(context);
	}
    },
    execute: function () {
	return this.node.execute();
    },
    toString: function() {
	return this.node.toString();
    }
};

// <repeat command> ::= repeat <number> <command list>
var RepeatCommandNode = function(){};
RepeatCommandNode.prototype = {
    parse: function(context) {
	context.skipToken("repeat");
	this.number = context.currentNumber();
	context.nextToken();
	this.commandListNode = new CommandListNode();
	this.commandListNode.parse(context);
    },
    execute: function() {
	var command_list = new Array();
	for (var i = 0; i < this.number; i++) {
	    var list = this.commandListNode.execute();
	    command_list = command_list.concat(list);
	}
	return command_list;
    },
    toString: function() {
	return "[repeat " + this.number + " " + this.commandListNode + "]";
    }
};

// <primitive command> ::= go | right | left
var PrimitiveCommandNode = function(){};
PrimitiveCommandNode.prototype = {
    parse: function(context) {
	this.name = context.currentToken;
	context.skipToken(this.name);
	if (this.name != "go" && this.name != "right" && this.name != "left") {
	    throw this.name + " is undefined";
	}
    },
    execute: function() {
	return new Array(this.name);
    },
    toString: function() {
	return this.name;
    }
};


var Context = function(text) { 
    this.tokenizer = new StringTokenizer(text);
    this.nextToken();
};


Context.prototype = {
    nextToken: function() {
	if (this.tokenizer.hasMoreTokens()) {
	    this.currentToken = this.tokenizer.nextToken();
	} else {
	    this.currentToken = null;
	}
	return this.currentToken;
    },
    skipToken: function(token) {
	if (token != this.currentToken) {
	    throw "Warning: " + token + " is expected, but " + this.currentToken + " is found.";
	}
	this.nextToken();
    },
    currentNumber: function() {
	return this.currentToken;
    }
};

Context.prototype.currentToken = function() {
    return this.currentToken;
};

	

var StringTokenizer = function(text) {
    this.tokens = text.split(/[\s\n]+/);
    this.index = 0;
};

StringTokenizer.prototype = {
    hasMoreTokens: function() {
	if (this.tokens.length < this.index + 1) {
	    return 0;
	} else {
	    return 1;
	}
    },
    nextToken: function() {
	var token = this.tokens[this.index];
	this.index += 1;
	return token;
    }
};