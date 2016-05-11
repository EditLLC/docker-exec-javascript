const process = require('process');
const vm = require('vm');
const montage = require('montagedata');

process.stdin.setEncoding('utf8');

let code = '';
let client = new Client(process.env.MONTAGE_TOKEN, process.env.MONTAGE_PROJECT);

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    code += chunk;
  }
});

process.stdin.on('end', () => {
  run_as_code();
});

function run_as_code() {
  let script = new vm.Script(code, {filename: 'main.js', displayErrors: true});
  let context = {
    client: client,
    montage: montage,
    Query: montage.Query,
    Field: montage.Field,
  }; //TODO montage client stuff
  let result = script.runInContext(context);
  if (typeof(result) == 'function') {
      result(client);
  }
}

function run_as_function() {
  let f = new Function('client', code);
  f(client);
}
