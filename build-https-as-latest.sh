git rev-parse HEAD > public/revision.txt
docker build . -f Dockerfile-https --no-cache -t tracardi/tracardi-gui-https

