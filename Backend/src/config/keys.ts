

let toExport: any;

if (process.env.NODE_ENV === 'production') {
    toExport = require('./prod');
}
else {
    toExport = require('./dev');
}

export default toExport;