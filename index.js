const fs = require('fs');
const config = require('./config.json');
const Discord = require('discord.js');
const { repeat } = require('ffmpeg-static');
const client = new Discord.Client();
const f_name = 'data.json';

client.login(config.token);


function readJson(fileName) { //arg1: type string
    let rawdata = fs.readFileSync(fileName);
    let data = JSON.parse(rawdata); //parse will converts a string into a JSON object

    return data; //returns a JSON oject
}

function writeJson(fileName, data) { //arg1: type string, arg2: type JSON object
    fs.writeFileSync(fileName, JSON.stringify(data));
}

function generateDate(date) { //type must be that of a Date
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    return date;
}


let student = {
    'user': 'Tanishq',
    'age': 23,
    'classes': ['Math', 'Physics', 'Comp. Sci.']
};

// for the json files, in order to format the file the command is shift + alt + f


console.log(readJson(f_name));

client.setInterval(() => {
    /* TO DO
        get guild -> get channels -> walk through and pick voice channels only -> use the members property -> log them as active 
        did every step besides logging the member. Need to a find a way to store information. 
    */
    var guilds = client.guilds.cache.array(); //all the guilds that the bot is in
    guilds.forEach(guild => { //got the guild 
        var channels = guild.channels.cache.array(); //getting all the channels for that particular guild (got the channels)
        channels.forEach(channel => { //looping threw the channels to filter any channels that are not voice channels
            if (channel.type === "voice") { //if it's a voice channel then look for active members in that channel (got voice channels)
                var members = channel.members.array(); //used member property
                members.forEach(member => { 
                    data = readJson(f_name); //read the data json file
                    if (guild.id in data === false) //check to see if the guild exists in our data, if it doesn't add it
                    {
                        data[guild.id] = {'guildName': guild.name, 'members': {}}; //default information need from the guild
                        writeJson(f_name, data);                                   
                        data = readJson(f_name);                                   //need to read again for the modified information 
                    }
                    var temp = data[guild.id].members; //get all the members 
                    if (member.id in temp === false) { //check to see if the member is in the data yet, if not then add 
                        temp[member.id] = {
                            'name': member.displayName,
                            'joinedAt': generateDate(member.joinedAt),
                            'loggingDate': generateDate(new Date()),
                            'time': 0
                        };
                        writeJson(f_name, data);
                    }

                    //everything above is for adding new members to the data 
                    data = readJson(f_name); 
                    data[guild.id].members[member.id].time++; //get the time of the member and increment 
                    writeJson(f_name, data);

                })
            }
            
        })
    })
}, 5 * 1000); //every minute

/*
client.on('message', message => {
    if (message.content.startsWith(config.prefix + 'ping')) { // more flexible than the === operator
        message.channel.send('Pong. . .');
    }
    else if (message.content.startsWith(config.prefix + 'server')) {
        message.channel.send('Server name: ' + message.guild.name);
    }
    else if (message.content.startsWith(config.prefix + 'channelinfo')) {
        message.channel.send('Channel type: ' + message.channel.type +
                            '\nCreated at: ' + message.channel.createdAt);
    }
    else if (message.content.startsWith(config.prefix + 'info')) {
            const guild = message.guild;
            message.channel.send('Owner: ' + guild.owner.displayName 
                                +'\nName: ' + guild.name
                                +'\nCreated At: ' + guild.createdAt 
                                +'\nMember Count: ' + guild.memberCount
                                );
    }
    else if (message.content.startsWith(config.prefix + 'nickname')) {
        const nickname = message.content.split(' ');
       if (nickname.length === 2 && message.guild.me.hasPermission('MANAGE_NICKNAMES'))
            message.member.setNickname(nickname[1])
            .then(mem => message.reply('Success your nickname has been changed!'))
            .catch(console.error);
        else if (nickname.length != 2)
            message.reply('Incorrect usage. Correct usage !nickname <your_nickname>');
        else
            message.reply('Sorry I don\'t have permissions to change nicknames! ):');
    }
    else if (message.content.startsWith(config.prefix + 'work')) {
        var ten = 10 * 60 * 1000;
        message.reply('Yes master! Anything for you (:');
        setInterval(function() {
            message.channel.send('.work').
            then(() => console.log('Sent!')).catch(console.error)
            
        }, 1000);
        setInterval(function() {
            message.channel.send('.deposit all').
            then(() => console.log('Sent!')).catch(console.error)
        }, ten + 1000);
        setInterval(function() {
            message.channel.send('.hourly').
            then(() => console.log('Sent!')).catch(console.error)
            
        }, 6 * ten);
        setInterval(function() {
            message.channel.send('.deposit all').
            then(() => console.log('Sent!')).catch(console.error)
        }, 6 * ten + 1000);

    }

});

client.on('message', async message => {
    if (!message.guild)
        return;
    if (message.content.startsWith(config.prefix + 'join')){
        if(message.member.voice.channel){
            const connection = await message.member.voice.channel.join();
            connection.play('./audio/first.mp3');
            connection.on()
        }
        else
            message.reply('Nobdy in comms ):');
        
    }   
});
*/