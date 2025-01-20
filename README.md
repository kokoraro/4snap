# 4snap

#### Discover, Share, & Execute Commands Anytime Anywhere

![4snap image](https://raw.githubusercontent.com/Benrobo/4snap/main/packages/app/public/screenshots/4snap-bg.png)

## Overview

4SNAP is a command snippet manager designed to simplify and streamline your development workflow. It allows you to save and organize your frequently used command snippets, making it easy to retrieve and execute them whenever needed. With 4SNAP, you can increase your productivity, reduce repetitive typing, and improve code consistency.

## Table of Contents

### Getting Started

- 1. Account Creation
- 2. Install 4Snap CLI
- 3. Authenticate 4Snap CLI
- 4. Create Commands
- 5. Executing Commands
- 6. Synchronization
- 7. View Saved Commands
- 8. Sharing Command

## Getting Started

Follow the steps below to get started with 4Snap.

### 1. Account Creation

Get started by creating an account on 4Snap using this [LINK](https://4snapp.vercel.app/auth). This will allow you to access and manage your commands.

### 2. Install 4Snap CLI

After creating an account on 4Snap, you need to install the 4Snap CLI npm package. Use the following command to install it:

```sh
// npm users
$ npm install 4snap

// yarn users
$ yarn add 4snap
```

### 3. Authenticate 4Snap CLI

Before you can execute any command, you need to authenticate the 4Snap CLI. Use the following command to authenticate:

```sh
$ 4snap login
```

This command will prompt you for a 4Snap token, which can be obtained from your settings page on 4Snap if you are currently logged in.

### 4. Create Commands

You can create commands or collections of commands either using the web interface or the CLI. To create a command using the CLI, run the following command:

```sh
$ 4snap create
```

This command will guide you through the steps needed to create your favorite command or collections of commands. Collections of commands are created by separating them with a comma (,).

### 5. Executing Commands

You can execute both local and public commands using the 4Snap CLI. To execute a local command, use the following command:

```sh
$ 4snap run [COMMAND_NAME]
```

For executing a public command, use the following command:

```sh
$ 4snap run -p [COMMAND_NAME]
```

Replace `[COMMAND_NAME]` with the name of the command you want to execute.

### 6. Synchronization

Sometimes, the commands created via the web interface may not be available on your local machine. To synchronize all created collections of commands and make them available on your local machine, use the following command:

```sh
$ 4snap sync
```

This command will ensure that all your created commands are synchronized.

### 7. View Saved Commands

To view your saved commands or collections of commands locally, use the following command:

```sh
$ 4snap list
```

This command will print out all available saved commands in a table format on your terminal.

### 8. Sharing Command

If you want to share your saved commands with others, whether publicly or privately, you can do so using the following command:

```sh
$ 4snap share -u [USER_NAME] [COMMAND_NAME]
```

Replace `[USER_NAME]` with the recipient's username and `[COMMAND_NAME]` with the name of the command you want to share.
