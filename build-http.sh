git rev-parse HEAD > public/revision.txt
docker build . --no-cache  -t tracardi/tracardi-gui:0.7.3-dev
docker push tracardi/tracardi-gui:0.7.3-dev
