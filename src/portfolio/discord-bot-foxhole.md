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


## Problem
### Background
[Foxhole](https://www.foxholegame.com/) is a persistent online War lasting weeks at a time, where other games might last hours. Players group into Regiments (sometimes called Clans or Guilds in other games), to work closer together, allowing coordinated efforts. As everything in the game is made by Players, there are places that we can store various items (materials, weapons, vehicles etc.) for later use or staging for an upcoming operation. These are stockpiles and we can create them at certain structures on the map.

### Stockpiles
These give 6 digit codes, which can be shared with others so that they can access them as well. <b>(TODO image)</b>. A very common solution is to create a discord channel that those codes are put into. This can get confusing, as new stockpiles are created and old ones expire. <b>TODO IMAGE</b>. My regiment started having one person collect and format them, which made it better, but still relied on someone. If they were away for some time, the same problems from before would occur again.


## My Solution
Building off of the single person editing a message to update the list of stockpiles, I could just create a discord bot, so that anyone could add or remove a message! This removes the reliance on a single person while keeping the benefits of a nicely.

### How it works


## Reflection
