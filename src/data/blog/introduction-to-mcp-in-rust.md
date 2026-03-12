---
title: Introduction to MCP in Rust
author: Fabian Bull
pubDatetime: 2026-03-11
postSlug: introduction-to-mcp-in-rust
featured: true
draft: true
tags:
  - rust
  - programming
  - tokio
  - learning
  - mcp
  - ai
  - model context protocol
description: This article gives a brief introduction to Model Context Protocol using Rust.
---

Independently of what you think of AI it's better to have an opinion based on facts and experience than just reiterating someone else's opinion.
Looking into how agents and all of this stuff works was on my to-do list for some months now so I took the chance to combine it with something I enjoy, programming in Rust.

The [Model Context Protocol][1] is one of these topics you stumble over when you look into the field of Agentic AI.
It is intended to supply the AI with context, hence the name, that was not present at the time of training.
If you skim over the homepage, you will quickly find the [Rust SDK][2].

# Setup

The main crate we will need is called [rmcp][3].
All the other crates in the `Cargo.toml` are only there, because rmcp depends on them.

```toml file=Cargo.toml
[package]
name = "learning-mcp"
version = "0.1.0"
edition = "2024"

[dependencies]
rmcp = { version = "1.2", features = ["server", "transport-io"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
schemars = "1"
```

# The Server

An MCP server can provide multiple services to an LLM but for now I was most interested in _Tools_.
A Tool allows the agent to execute a single piece of code.
In my example it provides the agent with a proper greeting given the name of the person.

The code is straightforward:

1. A server can have multiple tools which are handled by a _ToolRouter_.
2. Make your router known to the tool scanner.
3. Provide a description and implementation of your tool.
4. Make it public that your server provides tools.
5. Start the server or as Picard would say: _Engage!_

```rust file=src/main.rs
use rmcp::{
    ErrorData as McpError, ServerHandler, ServiceExt,
    handler::server::{router::tool::ToolRouter, wrapper::Parameters},
    model::*,
    schemars, tool, tool_handler, tool_router,
    transport::stdio,
};

#[derive(Debug, serde::Deserialize, schemars::JsonSchema)]
struct GreetRequest {
    /// The name to greet
    name: String,
}

#[derive(Clone)]
struct GreetServer {
    // 1. Provide a tool router
    tool_router: ToolRouter<Self>,
}

// 2. Register your tool router
#[tool_router]
impl GreetServer {
    fn new() -> Self {
        Self {
            tool_router: Self::tool_router(),
        }
    }


    // 3. Register a tool and give a description
    /// Greet someone by prefixing "hello" to their name
    #[tool(
        name = "to greet",
        description = "Prefix 'hello' to the given name",
        annotations(read_only_hint = true)
    )]
    async fn to_greet(
        &self,
        Parameters(req): Parameters<GreetRequest>,
    ) -> Result<CallToolResult, McpError> {
        Ok(CallToolResult::success(vec![Content::text(format!(
            "hello {}",
            req.name,
        ))]))
    }
}

#[tool_handler]
impl ServerHandler for GreetServer {
    fn get_info(&self) -> ServerInfo {
        // 4. Inform the agent that this MCP has tools
        ServerInfo::new(ServerCapabilities::builder().enable_tools().build())
            .with_server_info(Implementation::from_build_env())
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting MCP greet server");

    // 5. Engage!!!
    let service = GreetServer::new()
        .serve(stdio())
        .await
        .inspect_err(|e| tracing::error!("serving error: {:?}", e))?;

    service.waiting().await?;
    Ok(())
}
```

# Testing

Now that you have this thing compiling and everything works, or does it?
How can we test it?

Turns out there is this cool tool called [Inspector][4].
To run it with our toy example just run

```sh
npx @modelcontextprotocol/inspector cargo run
```

_Disclaimer: npx is from this ugly world called "Node". You might have to install it first._

After running this, you are greeted with a relatively self-explanatory UI.
You can test your server and get a sense of all the other features MCP provides this way.

# Connecting it to OpenCode

Testing the thing is nice but I want to see it in action.
I use [OpenCode][5] so I hooked it up adding the following lines to my configuration:

```json
{
  "mcp": {
    "greeter": {
      "command": ["learning-mcp"],
      "enabled": true,
      "type": "local"
    }
  }
}
```

This configuration expects the MCP to be on the _$PATH_ so you have to run `cargo install --path .` inside the project directory.

Opening OpenCode will show you the new server in the right panel. But how can we force the agent to use it?
My first prompt was something like: "Please greet me." But apparently it's so smart that it is able to greet you on its own and won't bother using the MCP server.

With a little talk however, I convinced the agent to make use of it and OpenCode asked me for the name of the person to greet and responded with the correct response.

[1]: https://modelcontextprotocol.io
[2]: https://github.com/modelcontextprotocol/rust-sdk
[3]: https://crates.io/crates/rmcp
[4]: https://modelcontextprotocol.io/docs/tools/inspector
[5]: https://opencode.ai/
