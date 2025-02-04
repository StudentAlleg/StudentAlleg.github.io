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
* Linux Services
* SSH

## My Solution
Since I have already [made a discord bot in the past](/portfolio/discord-bot-foxhole), I had a strong foundation with which to base this [discord.py](https://discordpy.readthedocs.io/en/stable/) bot on. The [Steam API](https://steamcommunity.com/dev) has a handy API that when queried returns the number of players currently in a specific game. Pass in the game id and our API key, and we have the data we need.
So just send a message everytime that number changes and that would be fine!
### Permanance
Running a discord bot 

