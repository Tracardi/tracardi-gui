git rev-parse HEAD > public/revision.txt
docker build . --rm --no-cache -f mt.Dockerfile -t tracardi/tracardi-mt-gui:0.7.4
docker push tracardi/tracardi-mt-gui:0.7.4
