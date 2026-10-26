# Docker

## Prerequisites

You have created an empty `docker-compose.override.yml` file in the root directory of this repository.

## Docker Network

If you want to run the stack in a docker network, you need to change the `BACKEND_HOST` variable in the root `.env` file
to `stockhome-backend`. To add a docker network, create a `docker-compose.override.yml` file in the root directory of
this repository with the following content:

```yaml
services:
  admin-frontend:
    networks:
      - proxynet

  backend:
    networks:
      - proxynet

  usr-frontend:
    networks:
      - proxynet

  no-as-a-service:
    networks:
      - proxynet

  mysql:
    networks:
      - proxynet

networks:
  proxynet:
    external: true
```

To start off I recommend to set the `BACKEND_HOST` variable to `localhost` and start the stack without a docker network.
After you have started the stack and everything is working, you can add a docker network.

## Ports

### Change Exposed Ports

If you want to change the exposed ports, you can do this in the `docker-compose.yml` file like so:

```yaml
services:
  mysql:
    ports:
      - "3306:3306"

  backend:
    ports:
      - "8004:8004"

  usr-frontend:
    ports:
      - "80:80"
```

### Remove Exposed Ports

If you want to remove the exposed ports, you can do this in the `docker-compose.override.yml` file like so:

```yaml
services:
  mysql:
    ports: !override [ ]

  backend:
    ports: !override [ ]

  usr-frontend:
    ports: !override [ ]
```
