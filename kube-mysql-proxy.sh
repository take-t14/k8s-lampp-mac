#!/bin/bash

/usr/local/bin/kubectl config set-context microk8s --namespace=k8s-lampp-mac  
/usr/local/bin/kubectl port-forward mysql-0 3306:3306