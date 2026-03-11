---
title: Hardening Firefox
author: Fabian Bull
pubDatetime: 2025-08-31T14:22:21Z
postSlug: hardening-firefox
featured: false
draft: false
tags:
  - firefox
  - security
description: Setting properties to harden Firefox
---

I like to keep Firefox fast, minimal, and private. Here are the settings:

- `browser.startup.page = 3` – restore previous session
- `browser.startup.homepage = "https://fbull.de"` – set homepage
- `browser.tabs.groups.enabled = true` – enable tab groups
- `browser.tabs.groups.smart.enabled = true` – enable smart tab grouping
- `browser.tabs.loadInBackground = true` – open new tabs in background
- `browser.tabs.warnOnClose = false` – no warning on closing multiple tabs
- `browser.tabs.warnOnOpen = false` – no warning on opening many tabs
- `browser.ml.chat.enabled = false` – disable ML chat feature
- `browser.urlbar.suggest.bookmark = false` – don’t suggest bookmarks
- `browser.urlbar.suggest.history = true` – suggest from history
- `browser.urlbar.suggest.openpage = false` – don’t suggest open tabs
- `browser.urlbar.suggest.pocket = false` – don’t suggest Pocket content
- `browser.urlbar.suggest.searches = false` – don’t suggest searches
- `browser.newtabpage.activity-stream.discoverystream.enabled = false` – disable discovery stream
- `browser.newtabpage.activity-stream.showSponsored = false` – disable sponsored content
- `browser.translations.enable = false` – disable built-in translations
- `privacy.trackingprotection.emailtracking.enabled = true` – block email tracking
- `privacy.trackingprotection.enabled = true` – enable tracking protection
- `privacy.trackingprotection.socialtracking.enabled = true` – block social tracking
- `privacy.donottrackheader.enabled = true` – send Do Not Track header
- `privacy.fingerprintingProtection = true` – enable fingerprinting protection
- `privacy.resistFingerprinting = true` – resist fingerprinting
- `dom.security.https_only_mode_ever_enabled = true` – remember HTTPS-only preference
- `dom.security.https_only_mode = true` – enforce HTTPS-only mode
- `extensions.pocket.enabled = false` – disable Pocket

These tweaks disable things I don’t need (Pocket, ML chat, sponsored content) while enabling stronger privacy protections (tracking protection, HTTPS-only, anti-fingerprinting).

Simple, private, and efficient.
