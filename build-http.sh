git rev-parse HEAD > public/revision.txt
docker build . --no-cache  -t tracardi/tracardi-gui
docker push tracardi/tracardi-gui

