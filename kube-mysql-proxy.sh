#!/bin/bash

/usr/local/bin/kubectl config set-context docker-desktop --namespace=k8s-lampp-mac  
/usr/local/bin/kubectl port-forward mysql-0 3306:3306