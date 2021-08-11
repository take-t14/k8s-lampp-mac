#!/bin/bash

/usr/local/bin/kubectl config set-context docker-desktop --namespace=k8s-lampp-mac  
nohup /usr/local/bin/kubectl port-forward mysql-0 3306:3306 > /dev/null 2>&1 &
