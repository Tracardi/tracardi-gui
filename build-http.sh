git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache  -t tracardi/tracardi-gui:0.7.3
docker push tracardi/tracardi-gui:0.7.3
