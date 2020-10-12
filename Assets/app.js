function green(message){return "[[gb;#44D544;black]"+message+"]";}


var banner=green(
" _______  __    _  _______  _______  ___       \n"+
"|   _   ||  |  | ||       ||       ||   |        \n"+
"|  |_|  ||   |_| ||    ___||    ___||   |     \n"+
"|       ||       ||   | __ |   |___ |   |        \n"+
"|       ||  _    ||   ||  ||    ___||   |___  \n"+
"|   _   || | |   ||   |_| ||   |___ |       | \n"+
"|__| |__||_|  |__||_______||_______||_______| \n"+
"",);


var intro = "Reading package lists... Done\n" +
    "Reading state information... Done\n\n" +
    "Hello world, welcome to my website. I'm Angel.\n" +
    "I am a software developer. I like to create things.\n";
var commands = {
    help: function() {
        this.echo("contact      show my contact information");
        this.echo("whoami       get to know me")
    },
    contact: function() {
        this.echo("Email: AngelAlfarox at gmail dot com\n" +
            "Github: @ AngelsGit\n");
    },
    whoami: function() {
        this.echo("I am 24 years old, my passion is technology and I love to learn how things work.\n" +
            "Currently, I am working towards my Bachelors in Computer Science with a minor in Intelligent Robotic Systems at the University of Central Florida.\n" +
            "Languages: html, css, javascript, python, Java \n");
    }
}
$(function() {
    var isTyping = false;

    function typed(finish_typing) {
        return function(term, message, delay, finish) {
            isTyping = true;
            var prompt = term.get_prompt();
            var c = 0;
            if (message.length > 0) {
                term.set_prompt('');
                var interval = setInterval(function() {
                    term.insert(message[c++]);
                    if (c == message.length) {
                        clearInterval(interval);
                        setTimeout(function() {
                            finish_typing(term, message, prompt);
                            isTyping = false
                            finish && finish();
                        }, delay);
                    }
                }, delay);
            }
        };
    }
    var typed_prompt = typed(function(term, message, prompt) {
        term.set_command('');
        term.set_prompt(message + ' ');
    });
    var typed_message = typed(function(term, message, prompt) {
        term.set_command('');
        term.echo(message)
        term.set_prompt(prompt);
        term.echo("To view all commands type " + green("help"));
        term.echo("Want to get in touch? Type " + green("contact"));
    });
    $('body').terminal(commands, {
        greetings: banner,
        prompt: "hi@Angel:~# ",
        completion: true,
        checkArity: false,
        onInit: function(term) {
            typed_message(term, intro, 35, function() {});
        },
        keydown: function(e) {
            if (isTyping) {
                return false;
            }
        },
        onBlur: function() {
            return false;
        },
        onClear: function(term) {
            term.echo(banner);
            term.echo(intro + "\n")
        }
    });
});
var base = 'https://raw.githubusercontent.com/iamcal/emoji-data/master/img-emojione-64/';
$.get('https://cdn.rawgit.com/iamcal/emoji-data/master/emoji.json').then(function(list) {
    var style = $('<style>');
    var text = {};
    var names = [];
    list.forEach(function(emoji) {
        var rule = '.emoji.' + emoji.short_name + '{' +
            'background-image: url(' + base + emoji.image + ');' +
            '}';
        style.html(style.html() + rule + '\n');
        text[emoji.text] = emoji.short_name;
        names.push(emoji.short_name);
    });
    var re = new RegExp('(' + Object.keys(text).map(function(text) {
        return $.terminal.escape_regex(text);
    }).join('|') + ')', 'g');
    style.appendTo('head');
    $.terminal.defaults.formatters.push(function(string) {
        return string.replace(/:([^:]+):/g, function(_, name) {
            if (names.indexOf(name) === -1) {
                return _;
            }
            return '[[;;;emoji ' + name + '] ]';
        }).replace(re, function(name) {
            return '[[;;;emoji ' + text[name] + '] ]';
        });
    });
});
