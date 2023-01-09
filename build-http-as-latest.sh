git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache -f http.Dockerfile -t tracardi/tracardi-gui
docker push tracardi/tracardi-gui
