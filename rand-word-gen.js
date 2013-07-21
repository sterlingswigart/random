#!/usr/bin/env node

function Next(next_node) {
    this.next_node = next_node;
    this.times = 0;
}

function Node(letter) {
    this.letter = letter;
    // If this weren't a randomly ordered set, it would be best to sort
    // it with the highest frequency letters first. This way, we will iterate
    // over fewer edges when generating words for a big dictionary.
    this.next = {};  // Letter -> Next
    this.totaltimes = 0;
}

function Model(dict) {
    this.root = new Node("START");
    this.end = new Node("END");
    this.nodes = {};

    for (var i = 0; i < dict.length; i++) {
        var word = dict[i];
        var curr = this.root;
        for (var l = 0; l < word.length; l++) {
            // Get a node for the current letter.
            var letter = word[l];
            if (!(letter in this.nodes)) {
                this.nodes[letter] = new Node(letter);
            }
            var next_node = this.nodes[letter];

            // Link the previous node to the current letter.
            if (!(letter in curr.next)) {
                curr.next[letter] = new Next(next_node);
            }
            curr.next[letter].times++;
            curr.totaltimes++;

            curr = next_node;
        }

        if (!(this.end in curr.next)) {
            curr.next["END"] = new Next(this.end);
        }
        curr.next["END"].times++;
    }
}

var MAX_RETRIES = 10;
var MAX_LENGTH = 25;

var ContainsLoops = function(output) {
    // Only let sequences of 1-5 characters be repeated at most twice in a row.
    for (var i = 1; i < 6; i++) {
        var repeating = false;
        for (var j = i * 2; j <= output.length; j++) {  // NOTE: j may be out of range.
            var seq = output.substring(j - i, j);
            var prev_seq = output.substring(j - i * 2, j - i);
            if (seq == prev_seq) {
                if (/* already */ repeating) {
                    return true;
                }
                repeating = true;
            }
        }
    }
    return false;
}

Model.prototype.getRandomWord = function() {
    var curr = this.root;
    for (var retries = 0; retries < MAX_RETRIES; retries++) {
        var too_long = false;
        var output = "";
        while (curr != this.end) {
            // Choose next node based on probability of next letter in dictionary.
            // TODO: Subtraction doesn't work correctly. Evident with a
            // single-word dictionary.
            var count = Math.floor(Math.random() * curr.totaltimes);
            for (letter in curr.next) {
                count -= curr.next[letter].times;
                if (count <= 0) {
                    curr = curr.next[letter].next_node;
                    break;
                }
            }

            if (curr != this.end) {
                output += curr.letter;
            }

            if (output.length > MAX_LENGTH) {
                // Try again rather than chopping it off unless we've tried
                // too many times.
                too_long = true;
                break;
            }
        }
        // Rather than controlling for loops and length during word construction,
        // just try again if the output doesn't fit our constraints.
        if (!too_long && !ContainsLoops(output)) { break; }
    }
    return output;
}

/*
console.log("ContainsLoops(\"papapa\") = " + ContainsLoops("papapa"));
console.log("ContainsLoops(\"pizzapizzapizza\") = " + ContainsLoops("pizzapizzapizza"));
console.log("ContainsLoops(\"eeeeeeeeeeee\") = " + ContainsLoops("eeeeeeeeeeee"));
console.log("ContainsLoops(\"papa\") = " + ContainsLoops("papa"));
console.log("ContainsLoops(\"repeatedrepeatedrepeated\") = " + ContainsLoops("repeatedrepeatedrepeated"));

var m = new Model(["APPLE", "APE", "GAPE", "ALE", "ZAP", "HALLO", "ACK"]);
var m = new Model(["papapa"]);
*/

var m = new Model(["papapapapapa",
                   "helielielieli",
                   "pizzapizzapizzapizza",
                   "repeatedrepeatedrepeated",
                   "valid"]);

output = [];
for (var i = 0; i < 1; i++) {
    output.push(m.getRandomWord());
}
console.log(output.join(" "));
