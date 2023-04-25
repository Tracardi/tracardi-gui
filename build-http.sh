git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache -f http.Dockerfile -t tracardi/tracardi-gui:0.8.2-dev
docker push tracardi/tracardi-gui:0.8.2-dev
