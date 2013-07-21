#!/usr/bin/env node
// Generates random words based on an input dictionary by building up a graph where
// the nodes are letters and the directed edges are built for each letter that follows.
//
// TODO: Generates interesting results when sequences within the input words can begin
// and end words. For example, "ART" and "TRUCK" could generate the words "T"
// and "TRTRT". Rather than only using single letters in our graph, we could somehow
// represent sequences as well.

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

Node.prototype.addNextNode = function(next_node) {
    if (!(next_node.letter in this.next)) {
        this.next[next_node.letter] = new Next(next_node);
    }
    this.next[next_node.letter].times++;
    this.totaltimes++;
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

            curr.addNextNode(next_node);
            curr = next_node;
        }

        curr.addNextNode(this.end);
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
    for (var retries = 0; retries < MAX_RETRIES; retries++) {
        var curr = this.root;
        var too_long = false;
        var output = "";
        while (curr != this.end) {
            // Choose next node based on probability of next letter in dictionary.
            var count = Math.ceil(Math.random() * curr.totaltimes);
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

var m = new Model(["papapapapapa",
                   "helielielieli",
                   "pizzapizzapizzapizza",
                   "repeatedrepeatedrepeated",
                   "valid"]);
var m = new Model(["papapa"]);
*/

var m = new Model(["APPLE", "APE", "GAPE", "ALE", "ZAP", "HALLO", "ACK", "SWALLOW",
                   "FACE", "APPARATUS", "RAY", "RAIL", "HELP", "PLAY", "SWAY"]);

output = [];
for (var i = 0; i < 10; i++) {
    output.push(m.getRandomWord());
}
console.log(output.join(" "));
