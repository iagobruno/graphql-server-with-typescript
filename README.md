# graphql-server-with-typescript

A simple [GraphQL](https://graphql.org) server using [NodeJS](https://nodejs.org) and [TypeScript](https://www.typescriptlang.org).

<!-- [![Online playground](https://img.shields.io/badge/Online-Playground-E00097.svg)]() -->

## Motivation

Currently, in 2019, to create a GraphQL API it's necessary to write a schema with the type of inputs and outputs of server, which is usually defined in a text file called `schema.graphql`. That is not a problem for applications that use pure JavaScript, but it can create a headache if you want to use [TypeScript](https://www.typescriptlang.org/) to ensure type-safety of code, because the developer need to sync the schema with TypeScript types and **this is NOT productive**.

## Solutions

Some time ago, I [tried to create a server](https://github.com/httpiago/graphql-and-typescript) using a package called "[type-graphql](https://github.com/19majkel94/type-graphql)" which aims to automate the creation of the schema based on code writed using [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html). I reached my goal and I was pleased with the result but now, looking the code, I found some problems: decorators are not a standard yet, the code gets more verbose and difficult for other developers to maintain and the package in question still needs to be improved.

Anyway, with this project I want to try another approach: automate the creation of code typings based on schema and this time I will use another package called "[graphql-codegen](https://github.com/dotansimha/graphql-code-generator)".

## Installation

```bash
git clone https://github.com/httpiago/graphql-server-with-typescript.git
cd graphql-server-with-typescript
yarn install
```

and start the server:

```bash
yarn run start
```

## To do

- [x] Install [Apollo](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server).
- [x] Install [graphql-codegen](https://github.com/dotansimha/graphql-code-generator).
- [ ] Create revolvers for users.
- [ ] Create resolvers for tweets.
- [ ] Create subscription to listen new tweets.
- Security:
  - [ ] Create an authentication system.
  - [ ] Limit query complexity.
  - [ ] Limit query depth.
- [ ] Make server publicly available with Heroku.
- [ ] Write some tests just to see.
  - Use [Jest](https://github.com/facebook/jest) with [GitHub Actions](https://github.com/features/actions) 🤩.
