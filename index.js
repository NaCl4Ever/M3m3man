'use strict';
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const env = require ('dotenv').config().parsed;
const rtm = new RtmClient(env.Slack_key);
const _ = require('lodash');
const snoowrap =  require('snoowrap');
console.dir(env);
// const r = new snoowrap({
//     userAgent: 'put your user-agent string here',
//     clientId: 'put your client id here',
//     clientSecret: 'put your client secret here',
//     refreshToken: 'put your refresh token here'
//   });
let channel;
let bot;
rtm.start();


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='example') { channel = c.id }
    }
    bot = '<@' + rtmStartData.self.id + '>';
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    rtm.sendMessage("Hello!", channel);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    if (message.channel === channel)
        console.log(message);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    if (message.channel === channel) {
        if (!_.isEmpty(message.text)) {
            var pieces = message.text.split(' ');
             
            if (pieces.length > 1) {
                if (pieces[0] === bot) {
                    var response = '<@' + message.user + '>';
                     
                    switch (pieces[1].toLowerCase()) {
                        case "jump":
                            response += '"Kris Kross will make you jump jump"';
                            break;
                        case "help":
                            response += ', currently I support the following commands: jump';
                            break;
                        default:
                            response += ', sorry I do not understand the command "' + pieces[1] + '". For a list of supported commands, type: ' + bot + ' help';
                            break;
                    }
                     
                    rtm.sendMessage(response, message.channel);
                }
            }
        }
    }
});
