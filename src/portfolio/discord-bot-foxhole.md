---
title: Foxhole Stockpiles Discord Bot
description: A discord bot to manage foxhole stockpiles 
date: 2023-01-06
link: https://github.com/StudentAlleg/foxhole-stockpiles
tags:
  - portfolio
  - discord
  - python
layout: layouts/portfolio.njk
---

## Overview
A very simple [discord.py](https://discordpy.readthedocs.io/en/stable/) python discord bot, run locally on my laptop. Takes user input, formats it, and edits current message.
### Skills Demonstrated
* Create a discord bot
* Install python packages
* Identify a problem and create a solution
* Git version control
* Discord.py


## Problem
[Foxhole](https://www.foxholegame.com/) is a persistent online War lasting weeks at a time, where other games might last hours. Players group into Regiments (sometimes called Clans or Guilds in other games), to work closer together, allowing coordinated efforts. As everything in the game is made by Players, there are places that we can store various items (materials, weapons, vehicles etc.) for later use or staging for an upcoming operation. These are stockpiles and we can create them at certain structures on the map.

### Stockpiles
These give 6 digit codes, which can be shared with others so that they can access them as well. <b>(TODO image)</b>. A very common solution is to create a discord channel that those codes are put into. This can get confusing, as new stockpiles are created and old ones expire. <b>TODO IMAGE</b>. My regiment started having one person collect and format them, which made it better, but still relied on someone. If they were away for some time, the same problems from before would occur again.


## My Solution
Building off of the single person editing a message to update the list of stockpiles, I could just create a discord bot, so that anyone could add or remove a message! This removes the reliance on a single person while keeping the benefits of a nicely formatted single message, easy to find what you want.
<b>INSERT IMAGE OF NEW FORMAT</b>

### How it works
#### Bot
Using [discord.py](https://discordpy.readthedocs.io/en/stable/), we can create text commands that users can run. We add the following capabilties. We can add a new code, remove an expired code, create a new stockpile message, and delete the current stockpile message.

This interface allows users
#### Stockpile
In a channel there is a single message, that holds all the stockpiles, correctly formatted. This is backed by by a text file, that acts as a database

## Reflection
### New Knowledge
* Storing and retrieving information from file
* Deserialize string into python objects
* Serialize python objects into string
* Install python packages
* Create a Python discord bot

### Usage
The bot did work and was usable. The problem was that it was clunky to use for other people. People did not like having to learn how to use my specific bot, so it ended up just being something that I used. It did not help that the bot was hosted on my laptop and was therefore only usable when my laptop was powered on. As my regiment became more and more inactive, it eventually no longer saw any use, as we reverted back to previous ways.

### How would I make it today
One of the tricky bits was creating the data structure and having persistent storage that did not rely on the discord message. I did the data structure correctly, by making it a class, though it was entangled a little bit with persistent storage. Still, fine for a small personal project. I would change how I did the persistant storage and instead use a database, probably a mysql .db file. This would make it easier to retrieve and store information.

I would also set it up on a Raspberry PI like my later [Allegiance Discord Bot](/portfolio/discord-bot-allegiance).
