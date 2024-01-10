---
title: Fixing Port Permissions for my Arduino
author: Fabian Bull
pubDatetime: 2024-01-10T13:23:23Z
postSlug: arduino-group-fix
featured: true
draft: false
tags:
  - Arduino
  - Linux
  - NixOS
description: This article describes how to fix a security issue when programming your Arduino.
---

I recently started tinkering with my Arduino again.
To upload my first sketch I used the [Arduino-CLI](https://arduino.github.io/arduino-cli):

```bash
arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:uno <MySketchName>
```

Unfortunately, this caused a _Permission Denied_ Error.

## The Fix

To use the serial port, a user has to be a member of the _dialout_ group.
The fix on most Linux distributions is to add the user to the group via:

```bash
sudo usermod -a -G dialout <username>
```

### On NixOS

As a [NixOS](https://nixos.org) however, I had to adjust my configuration:

```nix
users.users.fbull = {
  isNormalUser = true;
  description = "fbull";
  extraGroups = [ "networkmanager" "wheel" "video" "docker" "audio" "dialout" ];
  shell = pkgs.zsh;
};

```
