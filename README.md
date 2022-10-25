# Ngage Template Gateway

This repo using [Nx.dev](https://nx.dev) as workspace tool

## Requirements:

- Docker CE/Desktop 20 or above

- NodeJS LTS 16 or above

## Development

0. Access nuclent registry

   - Please follow [Github Package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token)

1. Run local dev services: _choose one_

   - Use docker: `docker compose up -d`

2. Dev:

   - Run: `yarn start connector`

   - Test: `yarn test connector`

   - Test with coverage: `yarn test connector --coverage`
