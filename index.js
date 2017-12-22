'use strict';
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const env = require ('dotenv').config().parsed;
const rtm = new RtmClient(env.Slack_key);
const _ = require('lodash');
const snoowrap =  require('snoowrap');
var CronJob = require('cron').CronJob;
const r = new snoowrap({
    userAgent: env.userAgent,
    clientId: env.clientId,
    clientSecret: env.clientSecret,
    refreshToken: env.refreshToken
  });
let channel = [];
let bot;
rtm.start();



rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member) { channel.push(c.id); }
    }
    bot = '<@' + rtmStartData.self.id + '>';
    console.dir(bot);
});

// Do something on opening the client
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    if (channel.indexOf(message.channel) !== -1) {
        console.dir(message);
        if (!_.isEmpty(message.text) && bot.indexOf(message.user) === -1) {
            var pieces = message.text.split(' ');
            if (pieces.length > 1) {
                if (pieces[0] === bot) {
                    var response = '<@' + message.user + '>';
                    switch (pieces[1].toLowerCase()) {
                        case "help":
                            response += ', currently I support the following commands: vidya, pic';
                            rtm.sendMessage(response, message.channel);
                            break;
                        case "vidya":
                            {
                                r.getSubreddit('youtubehaiku')
                                    .getTop({ time: 'week' })
                                    .then((results) => {
                                        console.log(results);
                                        let selectedIndex = Math.floor(Math.random() * results.length)
                                        rtm.sendMessage(results[selectedIndex].url, message.channel);
                                    })
                                    .catch(err => console.error(err));
                            }
                        break;
                        case "pic":
                            {
                                r.getSubreddit('dankmemes')
                                    .getTop({ time: 'week' })
                                    .then((results) => {
                                        console.log(results);
                                        let selectedIndex = Math.floor(Math.random() * results.length)
                                        rtm.sendMessage(results[selectedIndex].url, message.channel);
                                    })
                                    .catch(err => console.error(err));
                            }
                        break;
                        default:
                            response += ', sorry I do not understand the command "' + pieces[1] + '". For a list of supported commands, type: ' + bot + ' help';
                            rtm.sendMessage(response, message.channel);
                        break;
                    }
                     
                   
                }
            }
        }
    }
});

var j = new CronJob('* * * * *',
    function () {
        console.log('You will see this message every second');
        r.getSubreddit('dankmemes')
            .getTop({ time: 'week' })
            .then((results) => {
                let selectedIndex = Math.floor(Math.random() * results.length)
                for(channel in channels)
                {
                    rtm.sendMessage('Enjoy mah dudes!', channel);
                    rtm.sendMessage(results[selectedIndex].url, channel);
                }
                
            })
            .catch(err => console.error(err));
    }, null, true, 'America/Los_Angeles');
