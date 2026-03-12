---
title: "Learning Tokio Through Projects: From Echo Servers to Distributed Systems"
author: Fabian Bull
pubDatetime: 2025-09-19T13:23:23Z
postSlug: learning-tokio
featured: true
draft: false
tags:
  - rust
  - programming
  - tokio
  - learning
description: This article introduces my schedule to learn more about the tokio rust crate.
---

I want to get more comfortable with [Tokio](https://tokio.rs/), Rust's async runtime. Learning async Rust can feel intimidating, so I decided to take it step by step.

This is not a universal learning path. It is my personal plan, and I will update the list as I make progress and write dedicated articles for each project.

---

## Beginner Level

1. [**Async Echo Server**](async-echo-server)  
   Build a TCP server that accepts connections and echoes messages back.  
   _Concepts:_ `TcpListener`, `TcpStream`, spawning tasks with `tokio::spawn`.

2. [**Chat Server (Multi-client Echo)**](#)  
   Extend the echo server to broadcast messages from one client to all connected clients.  
   _Concepts:_ Using `tokio::sync::broadcast` channels for fan-out messaging, managing client lifetimes, handling dropped receivers.

3. [**Simple HTTP Server**](#)  
   Parse basic HTTP requests and return static responses, for example always return "Hello World".  
   _Concepts:_ Async I/O parsing, handling request and response framing.

---

## Intermediate Level

4. [**Async File Downloader**](#)  
   Given a URL, download the file asynchronously using `reqwest` with the Tokio runtime.  
   _Concepts:_ Async file I/O with `tokio::fs`, streaming large responses.

5. [**Key-Value Store Server**](#)  
   Create a TCP server where clients can `SET` and `GET` keys, similar to a toy Redis.  
   _Concepts:_ Parsing simple text protocols, storing state in memory, `tokio::select!`.

6. [**WebSocket Chat Application**](#)  
   Use `tokio-tungstenite` to build a chat app over WebSockets where clients can join rooms.  
   _Concepts:_ Higher-level protocols over TCP, managing multiple async streams.

---

## Advanced Level

7. [**Proxy Server (TCP Forwarder)**](#)  
   Build a transparent TCP proxy that forwards traffic between client and target server.  
   _Concepts:_ Bidirectional stream handling, `tokio::io::copy_bidirectional`.

8. [**Async DNS Resolver**](#)  
   Implement a minimal DNS client that sends UDP queries and parses responses.  
   _Concepts:_ Working with `tokio::net::UdpSocket`, binary protocol parsing.

9. [**Task Scheduler / Job Runner**](#)  
   Write a daemon that accepts jobs, for example shell commands, over TCP and runs them concurrently.  
   _Concepts:_ Process management with `tokio::process`, cancellation with `tokio::time`, graceful shutdown.

10. [**Miniature Distributed Key-Value Store**](#)  
    Extend your KV store into a cluster where nodes replicate data across the network.  
    _Concepts:_ Peer-to-peer communication, Raft-like consensus at a basic level, handling network partitions.

---

## Closing Thoughts

This list is **my** roadmap for learning Tokio.
It might change as I progress, and I will keep updating it with links and refinements.
If you are also learning async Rust, you might find some useful ideas here.
