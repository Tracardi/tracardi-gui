git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache -f mt.Dockerfile -t tracardi/tracardi-mt-gui:0.8.2-dev
docker push tracardi/tracardi-mt-gui:0.8.2-dev
