---
title: Allegiance Discord Bot
description: A discord bot to provide information on number of players online in a steam game
date: 2023-09-06
link: https://github.com/StudentAlleg/allegbot
tags:
  - portfolio
  - discord
  - python
  - requests
  - api
  - steam
  - raspberry pi
  - linux
layout: layouts/portfolio.njk
---
## Overview
A small [discord.py](https://discordpy.readthedocs.io/en/stable/) discord bot that querys the [Steam API](https://steamcommunity.com/dev) to display an updated count of players in [Microsoft Allegiance](https://store.steampowered.com/app/700480/Microsoft_Allegiance/).

## Problem
[Allegiance](https://store.steampowered.com/app/700480/Microsoft_Allegiance/) is a small community, since it is a game now 24 years old <b>TODO make this automatic</b>. Games only happen at certain times, usually on the weekend. People have made tools in the past that let people know how many players are in game, so that interested parties do not have to go through the full process. These have become inoperative over time.
### Skills Demonstrated
* Python
* Git version control
* Request from API
* Linux
* Linux Systemd
* SSH

## My Solution
Since I have already [made a discord bot in the past](/portfolio/discord-bot-foxhole), I had a strong foundation with which to base this [discord.py](https://discordpy.readthedocs.io/en/stable/) bot on. The [Steam API](https://steamcommunity.com/dev) has a handy API that when queried returns the number of players currently in a specific game. Pass in the game id and our API key, and we have the data we need.
So just send a message everytime that number changes and that would be fine!
### Permanance
Running a discord bot from my local machine does not work very well. People assume that the bot will always be up. For this specific bot, most of the time it will be used between Fridays and Sundays. I chose to use a [Respberry Pi Zero](https://www.raspberrypi.com/products/raspberry-pi-zero/) to host my bot on, because it is cheap and easy to use. Since my bot does not use many resources, it was perfect for my usecase.
#### Setup
After porting it to my [Respberry Pi Zero](https://www.raspberrypi.com/products/raspberry-pi-zero/) (I develop on Windows), we need to set it up to run automatically. RaspberryPi has systemmd's that we can define in a `.service` file, and then enable. [Here](https://linuxhandbook.com/create-systemd-services/) is a decent tutorial describing the process. From there, we can make it run on the startup and automatically retry if anything fails.
### Continued Improvements
While the bot worked, and was now always online, there was a few pain points. It was unclear whether the bot was online and working, or if there was just a long period between player count changes. [Allegiance](https://store.steampowered.com/app/700480/Microsoft_Allegiance/) does not see many players during the week, so it is not uncommon for the number online to settle at 1 or 2 (presumably someone just leaving it open on their computer). There was no way to check. To improve user experience, I added 2 things. The first being a command that the user could run, which would send them the current player count. The second being a counter of the number of times the bot had checked the API. These allowed users to see that the bot was working, online, and confirmed the current status.


## Reflection
### New Knowledge
* RaspberryPi
* Linux Systemmd
* Python virtual environments
* API Request

### Usage
For the scope of the project, it is just about perfect. Cheap, simple to run, and did not take a lot of development time. It stayed on scope and does what it needs to do. It outputs regulary in a discord channel setup for it, so sees use weekly. There is very little maintenance to do, after about a month of occasionally needing to fix a problem, I no longer need to do anything with it. Every so often I will manually restart the [Respberry Pi Zero](https://www.raspberrypi.com/products/raspberry-pi-zero/), but I really do not need to do that.

### How would I make it today
There is only really 2 problems that bother me today. First, it does not do dependency management at all. Python usually uses a `requirements.txt` file, this does not have it, meaning that if I or anyone else was to put it onto a different machine, it would have to be done manually. Second, it does not do secrets correctly. It should use a `.env` file, for things like the API key. Instead it uses a file called `key.py` that stores these as variables that are then imported.

