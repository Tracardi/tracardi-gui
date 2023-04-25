git rev-parse HEAD > public/revision.txt
docker build . --rm -f https.Dockerfile --no-cache -t tracardi/tracardi-gui-https:0.8.1

