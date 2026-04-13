---
title: Gossiping in Rust
author: Fabian Bull
pubDatetime: 2026-03-23
postSlug: gossiping-in-rust
featured: true
draft: true
tags:
  - programming
  - distributed systems
  - patterns
  - gossip
description: This article describes a Rust implementation of a gossip protocol
---

Gossiping is a way to share information within a cluster of nodes.
In the simplest form, it might be: _Which nodes are in this cluster?_
This article gives a brief introduction to _Gossip Dissemination_ and how I simulated it in Rust ([code][1]).

# A Simple Protocol

A cluster is just a set of processes, possibly running on different nodes, and they are all like Jon Snow: _They know nothing!_
A possible answer to the problem is the following protocol:

1. Each process gets information about an initial seed node.
2. After startup, each process tries to connect to the seed node and makes itself known.
3. Every time a process communicates with another process, it shares the list of known hosts.
   The process communicates its known hosts to previously unknown hosts.

This process is repeated over and over again, and information spreads like an infectious disease throughout the cluster.

# The Simulation

To prevent the hassle of dealing with real networking, we spawn a set of tasks that all communicate via a single broadcast channel.
(Yes, I know: not a great design, but it gets the job done.)
Instead of IP addresses, hosts are addressed by 32-bit integers, with host 0 as the initial seed node.

```rust
use tokio::sync::broadcast;
use std::collections::HashSet;

const NUM_HOSTS: u32 = 100;

/// Request and response message for a simple gossip protocol
#[derive(Debug, Clone)]
struct Message {
    /// Unique identifier of the sender
    from: u32,

    /// Unique identifier of the intended receiver
    to: u32,

    /// Set of hosts known to the sender
    known_hosts: HashSet<u32>,
}

// async tokio
#[tokio::main]
async fn main() {
    // get number of hosts from command line argument
    let num_hosts = std::env::args()
        .nth(1)
        .and_then(|s| s.parse::<u32>().ok())
        .unwrap_or(NUM_HOSTS);

    // This channel serves as a simple message bus for all hosts. 
    // Each host will subscribe to this channel and filter messages intended for itself.
    let (tx, _) = broadcast::channel::<Message>(100000);

    let mut handles = Vec::new();
    for i in 0..num_hosts {
        let mut node_listener = tx.clone().subscribe();
        let node_sender = tx.clone();
        let handle = tokio::spawn(async move {
            let mut known_hosts: HashSet<u32> = [i].into_iter().collect();

            // At the start, each task makes itself known to host 0
            if i != 0 {
                let _ = node_sender.send(Message {
                    from: i,
                    to: 0,
                    known_hosts: known_hosts.clone(),
                });
            }

            // Afterwards, each host listens to new messages.
            while let Ok(msg) = node_listener.recv().await {
                // Only process messages that are intended for this host
                if msg.to != i {
                    continue;
                }
                println!(
                    "Host {} -> {}: {:?}",
                    i, msg.from, msg.known_hosts
                );
                for host in &msg.known_hosts {
                    if !known_hosts.contains(host) {
                        known_hosts.insert(*host);
                        // Send a set of known hosts to the newly discovered host
                        node_sender
                            .send(Message {
                                from: i,
                                to: *host,
                                known_hosts: known_hosts.clone(),
                            })
                            .unwrap();
                    }
                }

                if known_hosts.len() == num_hosts as usize {
                    println!("Host {} is done", i);
                    break;
                }
            }
        });
        handles.push(handle);
    }

    // Start the simulation
    for h in handles {
        h.await.unwrap();
    }
}
```

# Some Key Insights

If you run the program, you can immediately notice something: the program finishes!
That means every node becomes an Anti-Jon Snow and now knows about every other node.

A second thing you might ask yourself is: how many messages were sent?

```sh
cargo run --bin learning-gossip -q | grep -c '>'
```

This gives you an idea.
The 100 nodes sent 7090 messages, but of course this changes between runs.
Better than if everybody talked to everybody else, but there is room for improvement here.

# Outlook

Of course this is a very naive implementation.
It's more or less just a check that the protocol I made up actually converges.
It's also a great baseline upon which you can improve:

- The single broadcast channel blocks the simulation from finishing if the number of nodes is too large.
- What are ways to reduce the number of messages sent?
- How do these changes affect how fast information spreads throughout the cluster?

I think you get the idea.

Hope you had a good time. See you in the next article.

[1]: https://github.com/peri4n/learning-gossip
