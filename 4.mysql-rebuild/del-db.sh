#!/bin/bash

kubectl config set-context microk8s --namespace=k8s-lampp-mac  

kubectl delete -f k8s-sv.yaml

./del-db-data.sh