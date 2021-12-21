docker build . --no-cache -t tracardi/tracardi-gui
docker push tracardi/tracardi-gui
docker build . --no-cache -t tracardi/tracardi-gui:0.6.0
docker push tracardi/tracardi-gui:0.6.0

