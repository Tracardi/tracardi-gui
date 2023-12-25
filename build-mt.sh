git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache -f mt.Dockerfile -t tracardi/tracardi-mt-gui:0.9.0-dev
docker push tracardi/tracardi-mt-gui:0.9.0-dev
