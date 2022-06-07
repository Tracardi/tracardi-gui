git rev-parse HEAD > public/revision.txt
docker build . -t tracardi/tracardi-gui
docker push tracardi/tracardi-gui

