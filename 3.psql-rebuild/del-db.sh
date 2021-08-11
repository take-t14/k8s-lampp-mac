#!/bin/bash

kubectl config set-context docker-desktop --namespace=k8s-lapp-mac  

kubectl delete -f k8s-db-sv.yaml

if [[ -f ../1.db-disk/storage/php-apache-psql-data.img ]]; then
    rm -rf ../1.db-disk/storage/php-apache-psql-data.img
fi
