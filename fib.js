#!/usr/bin/env node

var fibonacci = function(n) {
    if (n < 1) {
        return 0;
    }
    if (n == 1 || n == 2) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

var fibs = {};

var fast_fib = function(n) {
    if (n < 1) {
        return 0;
    }
    if (n == 1 || n == 2) {
        return 1;
    }
    if (!(n in fibs)) {
        fibs[n] = fast_fib(n - 1) + fast_fib(n - 2);
    }
    return fibs[n];
}

var hrtime_to_str = function(n) {
    return n[0] + "." + String('000000000' + n[1]).slice(-9)
}

if (require.main == module) {
    now = process.hrtime();
    console.log("7th fibonacci number: " + fibonacci(7));
    console.log("Took " + hrtime_to_str(process.hrtime(now)) + " seconds.");

    now = process.hrtime();
    console.log("15th fibonacci number: " + fibonacci(15));
    console.log("Took " + hrtime_to_str(process.hrtime(now)) + " seconds.");

    now = process.hrtime();
    console.log("Quickly, the 15th fibonacci number: " + fast_fib(15));
    console.log("Took " + hrtime_to_str(process.hrtime(now)) + " seconds.");

    now = process.hrtime();
    console.log("Quickly, the 50th fibonacci number: " + fast_fib(50));
    console.log("Took " + hrtime_to_str(process.hrtime(now)) + " seconds.");
} else {
    exports.fibonacci = fibonacci;
    exports.fast_fib = fast_fib;
}
