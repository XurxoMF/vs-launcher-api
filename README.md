# Welcome to the VS Launcher API repo

This is a little API made to serve images, VS Versions and any other content needed.

To run this API just use this commands:

```sh
docker build -t vslapi-docker .
```

```sh
docker run --name vslapi -d -p <external-port>:3000 -v $(pwd)/db:/app/db -v $(pwd)/public:/app/public vslapi-docker
```
