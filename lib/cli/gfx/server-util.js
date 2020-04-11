/** Modified script from blessed-contrib server-util */
const blessed = require('blessed');

function OutputBuffer(options) { 
  this.isTTY = true;
  this.columns = options.cols;
  this.rows = options.rows;
  this.write = function(s) {
    s = s.replace('\x1b8', ''); //not clear from where in blessed this code comes from. It forces the terminal to clear and loose existing content.
    options.stream.write(s)
  };

  this.on = function() {};
}

function InputBuffer() {
  this.isTTY = true;
  this.isRaw = true;

  this.emit = function() {};

  this.setRawMode = function() {};
  this.resume = function() {};
  this.pause = function() {};

  this.on = function() {};
}

function serverError(err) {
  throw new Error(err)
}


function createScreen(opt = {}) {
  let cols = opt.cols || 250;
  let rows = opt.rows || 50;

  if (cols<=35 || cols>=500 || rows<=5 || rows>=300) {
    serverError('cols must be bigger than 35 and rows must be bigger than 5');
    return null;
  }
  
  const output = new OutputBuffer({stream: opt.stream, cols: cols, rows: rows});
  const input = new InputBuffer(); //required to run under forever since it replaces stdin to non-tty
  const program = blessed.program({output: output, input: input});

  let screen = blessed.screen({program: program});
  return screen
}


exports.createScreen = createScreen;