git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache -f http.Dockerfile -t tracardi/tracardi-gui:0.7.4
docker push tracardi/tracardi-gui:0.7.4
